package dao

import (
	"class-system/model"

	"gorm.io/gorm"
)

var DB *gorm.DB

func Init(db *gorm.DB) error {
	DB = db
	return db.AutoMigrate(&model.User{}, &model.Class{}, &model.Activity{}, &model.Signup{})
}
