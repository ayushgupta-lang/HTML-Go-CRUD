package database

import (
	"github.com/html-go-crud/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
	dsn := "user:password@tcp(localhost:3306)/dbname?parseTime=true"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	DB = db
}

func Migrate() {
	DB.AutoMigrate(&models.User{})
}
