package postgres

import (
	"errors"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagrams"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/ses"
)

type Postgres_SDK struct {
	Auth     *auth.Auth_SDK
	Diagram  *diagram.Diagram_SDK
	Diagrams *diagrams.Diagrams_SDK
	db       *gorm.DB
	jwk      *jwk.JWK_SDK
	ses      *ses.SES_SDK
	cluster  *models.ClusterModel
}

func Init(ses *ses.SES_SDK) (*Postgres_SDK, error) {
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

	// Print all table names
	var tables []string
	db.Raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").Pluck("table_name", &tables)
	fmt.Println(tables)

	if err := db.AutoMigrate(
		&models.ClusterModel{},
		&models.UserModel{},
		&models.DiagramModel{},
		&models.DiagramUserRoleModel{},
		&models.JWTModel{},
		&models.EmailVerificationTokenModel{},
		&models.PasswordResetTokenModel{},
	); err != nil {
		return nil, err
	}

	cluster, err := getCluster(db)
	if err != nil {
		return nil, err
	}

	p := &Postgres_SDK{
		db:      db,
		ses:     ses,
		cluster: cluster,
	}

	p.createFuntionsAndTriggers()

	go p.gracefulShutdown()

	if p.jwk, err = jwk.Init(db, dsn, cluster); err != nil {
		p.shutdown()
		return nil, err
	}

	p.Auth = auth.Init(db, p.jwk, ses)
	p.Diagram = diagram.Init(db, p.Auth)
	p.Diagrams = diagrams.Init(db, p.Auth)

	return p, nil
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

func (p *Postgres_SDK) gracefulShutdown() {
	cancelChan := make(chan os.Signal, 1)
	signal.Notify(cancelChan, syscall.SIGTERM, syscall.SIGINT)
	<-cancelChan

	p.shutdown()

	os.Exit(0)
}

func (p *Postgres_SDK) shutdown() {
	// Remove this cluster from the database
	if err := p.db.Delete(p.cluster).Error; err != nil {
		fmt.Println(err)
	}
}

func (p *Postgres_SDK) createFuntionsAndTriggers() {
	// Check if the pg_notify_jwt function exists
	var pg_notify_jwt_exists bool
	p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'pg_notify_jwt')").Scan(&pg_notify_jwt_exists)

	if !pg_notify_jwt_exists {
		// Use db.raw to create a pg_notify function if it doesn't exist
		p.db.Exec("CREATE FUNCTION pg_notify_jwt() RETURNS trigger AS $$ BEGIN PERFORM pg_notify('jwt', NEW.id); RETURN NEW; END; $$ LANGUAGE plpgsql;")
	}

	// Check if the pg_notify_jwt trigger exists
	var pg_notify_jwt_trigger_exists bool
	p.db.Raw("SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'pg_notify_jwt')").Scan(&pg_notify_jwt_trigger_exists)

	if !pg_notify_jwt_trigger_exists {
		// Use db.raw to create a trigger for the jwt_models table if it doesn't exist
		p.db.Exec("CREATE TRIGGER pg_notify_jwt AFTER INSERT ON jwt_models FOR EACH ROW EXECUTE PROCEDURE pg_notify_jwt();")
	}
}
