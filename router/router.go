package router

import (
	"class-system/dto"
	"class-system/handler"

	"github.com/flamego/binding"
	"github.com/flamego/flamego"
)

func RouteInit(e *flamego.Flame) {
	e.Post("/register", binding.JSON(dto.RegisterRequest{}), handler.HandleRegister)
	e.Get("/user", handler.HandleGetAllUsers)
	e.Delete("/user", binding.JSON(dto.DeleteUserByIDRequest{}), handler.HandleDeleteUserByID)
	e.Post("/getname", binding.JSON(dto.GetUserNameByIDRequest{}), handler.HandleGetUserNameByID)
	e.Get("/class", handler.HandleGetClass)
	e.Post("/activities", binding.JSON(dto.CreateActivitiesRequest{}), handler.HandleCreateActivities)
	e.Put("/activities/status", binding.JSON(dto.ChangeActivityStatusRequest{}), handler.HandleChangeActivityStatus)
	e.Post("/sign", binding.JSON(dto.SignupRequest{}), handler.HandleSignUpActivity)
	e.Get("/sign", handler.HandleGetSignups)
	e.Get("/activities", handler.HandleGetActivities)
	e.Delete("/activities", handler.HandleDeleteActivities)
	e.Delete("/sign", binding.JSON(dto.SignupRequest{}), handler.HandleDeleteSignUp)
}
