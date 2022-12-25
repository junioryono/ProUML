package postgres

import (
	"errors"
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

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
	// db.Migrator().DropTable(&models.UserModel{}, &models.DiagramModel{}, &models.DiagramUserRoleModel{}, &models.JWTModel{}, &models.EmailVerificationTokenModel{})

	// Print all table names
	var tables []string
	db.Raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").Pluck("table_name", &tables)
	fmt.Println(tables)

	if err := db.AutoMigrate(
		&models.UserModel{},
		&models.DiagramModel{},
		&models.DiagramUserRoleModel{},
		&models.JWTModel{},
		&models.EmailVerificationTokenModel{},
		&models.PasswordResetTokenModel{},
	); err != nil {
		return nil, err
	}

	jwk, err := jwk.Init(db)
	if err != nil {
		return nil, err
	}

	Auth := auth.Init(db, jwk, ses)
	Diagram := diagram.Init(db, Auth)
	Diagrams := diagrams.Init(db, Auth)

	p := &Postgres_SDK{
		Auth:     Auth,
		Diagram:  Diagram,
		Diagrams: Diagrams,
		db:       db,
		jwk:      jwk,
		ses:      ses,
	}

	return p, nil
}
