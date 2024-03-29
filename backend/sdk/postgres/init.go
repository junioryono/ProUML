package postgres

import (
	"errors"
	"fmt"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagrams"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/postgres/project"
	"github.com/junioryono/ProUML/backend/sdk/postgres/projects"
	"github.com/junioryono/ProUML/backend/sdk/sendgrid"
)

type Postgres_SDK struct {
	Auth     *auth.Auth_SDK
	Diagram  *diagram.Diagram_SDK
	Diagrams *diagrams.Diagrams_SDK
	Project  *project.Project_SDK
	Projects *projects.Projects_SDK
	db       *gorm.DB
	jwk      *jwk.JWK_SDK
	sendgrid *sendgrid.SendGrid_SDK
	cluster  *models.ClusterModel

	dsn string
}

func Init(sendgrid *sendgrid.SendGrid_SDK) (*Postgres_SDK, error) {
	Username := os.Getenv("POSTGRES_USERNAME")
	Password := os.Getenv("POSTGRES_PASSWORD")
	Host := os.Getenv("POSTGRES_HOST")
	Port := os.Getenv("POSTGRES_PORT")
	DB := os.Getenv("POSTGRES_DB")

	if Username == "" {
		return nil, errors.New("postgres username is empty")
	}

	if Password == "" {
		return nil, errors.New("postgres password is empty")
	}

	if Host == "" {
		return nil, errors.New("postgres host is empty")
	}

	if Port == "" {
		return nil, errors.New("postgres port is empty")
	}

	if DB == "" {
		return nil, errors.New("postgres db is empty")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=require TimeZone=UTC", Host, Username, Password, DB, Port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if dbC, err := db.DB(); err != nil {
		return nil, err
	} else {
		dbC.SetMaxIdleConns(22)
		dbC.SetMaxOpenConns(22)
		dbC.SetConnMaxLifetime(time.Hour)
	}

	// // Drop all tables
	// if err := db.Migrator().DropTable(
	// 	&models.ClusterModel{},
	// 	&models.UserModel{},
	// 	&models.DiagramModel{},
	// 	&models.DiagramUserRoleModel{},
	// 	&models.JWTModel{},
	// 	&models.EmailVerificationTokenModel{},
	// ); err != nil {
	// 	return nil, err
	// }

	// // Change all models.DiagramModel.Content to []
	// db.Exec("UPDATE diagram_models SET content = '[]'")

	// Print all table names
	var tables []string
	db.Raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").Pluck("table_name", &tables)
	fmt.Println(tables)

	// if err := db.AutoMigrate(
	// 	&models.ClusterModel{},
	// 	&models.UserModel{},
	// 	&models.DiagramModel{},
	// 	&models.DiagramUserRoleModel{},
	// 	&models.ProjectModel{},
	// 	&models.ProjectUserRoleModel{},
	// 	&models.IssueModel{},
	// 	&models.JWTModel{},
	// 	&models.EmailVerificationTokenModel{},
	// 	&models.PasswordResetTokenModel{},
	// ); err != nil {
	// 	return nil, err
	// }

	cluster, err := getCluster(db)
	if err != nil {
		return nil, err
	}

	p := &Postgres_SDK{
		db:       db,
		sendgrid: sendgrid,
		cluster:  cluster,
		dsn:      dsn,
	}

	if err := p.createFuntionsAndTriggers(); err != nil {
		p.Shutdown()
		return nil, err
	}

	if p.jwk, err = jwk.Init(p.getDb, dsn, cluster); err != nil {
		p.Shutdown()
		return nil, err
	}

	p.Auth = auth.Init(p.getDb, p.jwk, sendgrid)
	p.Diagram = diagram.Init(p.getDb, p.Auth)
	p.Diagrams = diagrams.Init(p.getDb, p.Auth)
	p.Project = project.Init(p.getDb, p.Auth)
	p.Projects = projects.Init(p.getDb, p.Auth)

	return p, nil
}

func (p *Postgres_SDK) getDb() *gorm.DB {
	// Make sure the database is still connected
	db, err := p.db.DB()
	if err != nil {
		// Unable to get the database connection from gorm
		return p.db
	}

	if err := db.Ping(); err != nil {
		var connected bool

		for !connected {
			// Try to reconnect to the database
			db2, err := gorm.Open(postgres.Open(p.dsn), &gorm.Config{})
			if err != nil {
				// Unable to reconnect to the database
				continue
			}

			// Set the new db connection
			p.db = db2

			connected = true
		}
	}

	return p.db
}

func getCluster(db *gorm.DB) (*models.ClusterModel, error) {
	var cluster *models.ClusterModel

	// Create a transaction
	result := db.Transaction(func(tx *gorm.DB) error {
		// Lock the cluster_models table
		tx.Exec("LOCK TABLE cluster_models IN EXCLUSIVE MODE")

		// Check if a master cluster exists
		masterExists := true

		var masterCluster models.ClusterModel
		if err := tx.Where("master = ?", true).First(&masterCluster).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				masterExists = false
			} else {
				return err
			}
		}

		// Save this cluster to the database
		cluster = &models.ClusterModel{
			ID:     uuid.New().String(),
			Master: !masterExists,
		}

		return tx.Create(cluster).Error
	})

	if result != nil {
		return nil, result
	}

	return cluster, nil
}

func (p *Postgres_SDK) Shutdown() {
	// Remove this cluster from the database
	if err := p.db.Delete(p.cluster).Error; err != nil {
		fmt.Println(err)
	}
}

func (p *Postgres_SDK) createFuntionsAndTriggers() error {
	// Check if the pg_notify_jwt function exists
	var pg_notify_jwt_exists bool
	if err := p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'pg_notify_jwt')").Scan(&pg_notify_jwt_exists).Error; err != nil {
		return err
	}

	if !pg_notify_jwt_exists {
		// Use db.raw to create a pg_notify function if it doesn't exist
		if err := p.db.Exec("CREATE FUNCTION pg_notify_jwt() RETURNS trigger AS $$ BEGIN PERFORM pg_notify('jwt', NEW.id); RETURN NEW; END; $$ LANGUAGE plpgsql;").Error; err != nil {
			return err
		}
	}

	// Check if the pg_notify_jwt trigger exists
	var pg_notify_jwt_trigger_exists bool
	if err := p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pg_notify_jwt')").Scan(&pg_notify_jwt_trigger_exists).Error; err != nil {
		return err
	}

	if !pg_notify_jwt_trigger_exists {
		// Use db.raw to create a trigger for the jwt_models table if it doesn't exist
		if err := p.db.Exec("CREATE TRIGGER pg_notify_jwt AFTER INSERT ON jwt_models FOR EACH ROW EXECUTE PROCEDURE pg_notify_jwt();").Error; err != nil {
			return err
		}
	}

	var add_cell_to_diagram_exists bool
	if err := p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_cell_to_diagram')").Scan(&add_cell_to_diagram_exists).Error; err != nil {
		return err
	}

	if !add_cell_to_diagram_exists {
		if err := p.db.Exec(`
		CREATE OR REPLACE FUNCTION add_cell_to_diagram(diagram_id text, new_cell jsonb)
		RETURNS void AS $$
		BEGIN
			UPDATE diagram_models
			SET content = content || new_cell
			WHERE id = diagram_id;
		END;
		$$ LANGUAGE plpgsql;`).Error; err != nil {
			return err
		}
	}

	// Check if the update_cell_in_diagram function exists
	var update_cell_in_diagram_exists bool
	if err := p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_cell_in_diagram')").Scan(&update_cell_in_diagram_exists).Error; err != nil {
		return err
	}

	if !update_cell_in_diagram_exists {
		if err := p.db.Exec(`
		CREATE OR REPLACE FUNCTION update_cell_in_diagram(diagram_id text, cell_id text, updated_cell jsonb)
		RETURNS void AS $$
		BEGIN
			UPDATE diagram_models
			SET content = (
				SELECT jsonb_agg(obj)
				FROM (
					SELECT 
						CASE 
							WHEN obj->>'id' = cell_id THEN updated_cell
							ELSE obj
						END AS obj
					FROM jsonb_array_elements(
						(SELECT content FROM diagram_models WHERE id = diagram_id)
					) AS obj
				) AS obj
			)
			WHERE id = diagram_id;
		END;
		$$ LANGUAGE plpgsql;`).Error; err != nil {
			return err
		}
	}

	var remove_cell_from_diagram_exists bool
	if err := p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'remove_cell_from_diagram')").Scan(&remove_cell_from_diagram_exists).Error; err != nil {
		return err
	}

	if !remove_cell_from_diagram_exists {
		if err := p.db.Exec(`
		CREATE OR REPLACE FUNCTION remove_cell_from_diagram(diagram_id text, cell_id text)
		RETURNS void AS $$
		BEGIN
			UPDATE diagram_models
			SET content = (
				CASE 
					WHEN EXISTS (
						SELECT 1 
						FROM jsonb_array_elements(content) AS obj 
						WHERE obj->>'id' <> cell_id
					) 
					THEN (
						SELECT jsonb_agg(obj) 
						FROM jsonb_array_elements(content) AS obj 
						WHERE obj->>'id' <> cell_id
					)
					ELSE '[]'::jsonb
				END
			)
			WHERE id = diagram_id;
		END;
		$$ LANGUAGE plpgsql;`).Error; err != nil {
			return err
		}
	}

	// Create ProjectModel with default ID if it doesn't exist
	if err := p.db.FirstOrCreate(&models.ProjectModel{ID: "default"}).Error; err != nil {
		return err
	}

	return nil
}
