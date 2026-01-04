package handler

import (
	"class-system/dao"
	"class-system/dto"
	"class-system/model"
	"class-system/service/response"
	error "errors"

	"github.com/flamego/binding"
	"github.com/flamego/flamego"
	"gorm.io/gorm"
)

func HandleGetClass(r flamego.Render, c flamego.Context) {
	var class []model.Class
	err := dao.DB.Model(&model.Class{}).WithContext(c.Request().Context()).Find(&class).Error
	if err != nil {
		response.ServiceErr(r, err.Error())
		return
	}

	response.HTTPSuccess(r, class)
}

func HandleRegister(r flamego.Render, c flamego.Context, req dto.RegisterRequest, errors binding.Errors) {
	if errors != nil {
		response.ServiceErr(r)
		return
	}

	var exist model.User
	err := dao.DB.Model(&model.User{}).WithContext(c.Request().Context()).Where("user_id= ?", req.UserID).First(&exist).Error
	if err != nil {
		if !error.Is(err, gorm.ErrRecordNotFound) {
			response.ServiceErr(r, err)
			return
		}
	} else {
		response.ServiceErr(r, "用户已存在")
		return
	}

	user := model.User{
		UserID:    req.UserID,
		SchoolNum: "hangdian",
		Name:      req.Name,
		Password:  req.Password,
		Phone:     req.Phone,
		Email:     req.Email,
		Role:      req.Role,
		ClassID:   req.ClassID,
	}

	err = dao.DB.Model(&model.User{}).WithContext(c.Request().Context()).Create(&user).Error
	if err != nil {
		response.ServiceErr(r, err)
		return
	}

	response.HTTPSuccess(r, nil)

}

func HandleGetUserNameByID(r flamego.Render, c flamego.Context, req dto.GetUserNameByIDRequest, errors binding.Errors) {
	if errors != nil {
		response.ServiceErr(r)
		return
	}

	var user model.User
	err := dao.DB.Model(&model.User{}).WithContext(c.Request().Context()).Where("user_id = ?", req.UserID).First(&user).Error
	if err != nil {
		response.ServiceErr(r, err)
		return
	}

	response.HTTPSuccess(r, user.Name)
}
func HandleCreateActivities(r flamego.Render, c flamego.Context, req dto.CreateActivitiesRequest, errors binding.Errors) {
	if errors != nil {
		response.ServiceErr(r)
		return
	}

	activity := model.Activity{
		Name:        req.Name,
		Description: req.Description,
		Location:    req.Location,
		StartTime:   req.StartTime,
		EndTime:     req.EndTime,
		LeaderID:    req.LeaderID,
		Budget:      req.Budget,
		MaxPeople:   req.MaxPeople,
		SignupStart: req.SignupStart,
		SignupEnd:   req.SignupEnd,
		Status:      req.Status,
	}

	err := dao.DB.Model(&model.Activity{}).WithContext(c.Request().Context()).Create(&activity).Error
	if err != nil {
		response.ServiceErr(r, err)
		return
	}

	response.HTTPSuccess(r, nil)
}

func HandleSignUpActivity(r flamego.Render, c flamego.Context, req dto.SignupRequest, errors binding.Errors) {
	if errors != nil {
		response.Forbidden(r)
		return
	}

	var exist model.Signup
	err := dao.DB.Model(&model.Signup{}).WithContext(c.Request().Context()).Where("activity_id = ? AND user_id = ?", req.ActivityID, req.UserID).First(&exist).Error
	if err != nil {
		if !error.Is(err, gorm.ErrRecordNotFound) {
			response.ServiceErr(r, err)
			return
		}
	} else {
		response.ServiceErr(r, "用户已报名该活动")
		return
	}

	signup := model.Signup{
		ActivityID: req.ActivityID,
		UserID:     req.UserID,
	}

	err = dao.DB.Model(&model.Signup{}).WithContext(c.Request().Context()).Create(&signup).Error
	if err != nil {
		response.ServiceErr(r, err)
		return
	}

	response.HTTPSuccess(r, nil)
}

func HandleDeleteSignUp(r flamego.Render, c flamego.Context, req dto.SignupRequest, errors binding.Errors) {
	if errors != nil {
		response.ServiceErr(r)
		return
	}

	err := dao.DB.Model(&model.Signup{}).WithContext(c.Request().Context()).Where("activity_id = ? AND user_id = ?", req.ActivityID, req.UserID).Delete(&model.Signup{}).Error
	if err != nil {
		response.ServiceErr(r, err)
		return
	}

	response.HTTPSuccess(r, nil)
}

func HandleGetActivities(r flamego.Render, c flamego.Context) {
	var activities []model.Activity
	err := dao.DB.Model(&model.Activity{}).WithContext(c.Request().Context()).Find(&activities).Error
	if err != nil {
		response.ServiceErr(r, err.Error())
		return
	}

	response.HTTPSuccess(r, activities)
}

func HandleDeleteActivities(r flamego.Render, c flamego.Context, req dto.DeleteActivitiesRequest, errors binding.Errors) {
	if errors != nil {
		response.ServiceErr(r)
		return
	}

	err := dao.DB.Model(&model.Activity{}).WithContext(c.Request().Context()).Where("id = ?", req.ActivityID).Delete(&model.Activity{}).Error
	if err != nil {
		response.ServiceErr(r, err.Error())
		return
	}

	response.HTTPSuccess(r, nil)
}

func HandleGetSignups(r flamego.Render, c flamego.Context) {

	var signups []model.Signup
	err := dao.DB.Model(&model.Signup{}).WithContext(c.Request().Context()).Find(&signups).Error
	if err != nil {
		response.ServiceErr(r, err.Error())
		return
	}

	response.HTTPSuccess(r, signups)
}
