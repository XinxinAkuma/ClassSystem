package dao

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPG() error {
	var err error

	dsn := "host=127.0.0.1 user=user password=password dbname=ClassSystemDB port=16432 sslmode=disable TimeZone=Asia/Shanghai"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}

	err = Init(db)
	if err != nil {
		log.Fatal("建表失败:", err)
	}
	return err
}
