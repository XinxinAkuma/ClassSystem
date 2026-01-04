package main

import (
	"class-system/dao"
	"class-system/router"

	"github.com/flamego/flamego"
)

var (
	F *flamego.Flame
)

func init() {

	_ = dao.InitPG()
	F = flamego.New()

	// 添加基础中间件
	F.Use(flamego.Logger())
	F.Use(flamego.Recovery())
	F.Use(flamego.Static(flamego.StaticOptions{
		Directory: "public",
	}))

	// 添加 Renderer 中间件
	F.Use(flamego.Renderer())

	// 添加 CORS 中间件
	F.Use(func(c flamego.Context) {
		c.ResponseWriter().Header().Set("Access-Control-Allow-Origin", "*")
		c.ResponseWriter().Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.ResponseWriter().Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		if c.Request().Method == "OPTIONS" {
			c.ResponseWriter().WriteHeader(200)
			return
		}
	})

	router.RouteInit(F)

}
