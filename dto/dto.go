package dto

import (
	"time"
)

type RegisterRequest struct {
	UserID    string `json:"user_id" `
	SchoolNum string `json:"school_num" `
	Name      string `json:"name"`
	Password  string `json:"password" `
	Phone     string `json:"phone" `
	Email     string `json:"email"`
	Role      string `json:"role"`
	ClassID   string `json:"class_id" `
}

type CreateActivitiesRequest struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	StartTime   time.Time `json:"startTime"`
	EndTime     time.Time `json:"endTime"`
	SignupStart time.Time `json:"signupStart"`
	SignupEnd   time.Time `json:"signupEnd"`
	LeaderID    string    `json:"leader_id"`
	Budget      float64   `json:"budget"`
	Status      string    `json:"status"`
	MaxPeople   int       `json:"maxPeople"`
}

type SignupRequest struct {
	ActivityID uint   ` json:"activityId"`
	UserID     string `json:"userId"`
}

type DeleteActivitiesRequest struct {
	ActivityID uint ` json:"activityId"`
}

type GetUserNameByIDRequest struct {
	UserID string `json:"userId"`
}

type DeleteUserByIDRequest struct {
	UserID string `json:"userId"`
}

type ChangeActivityStatusRequest struct {
	ActivityID uint   ` json:"activityId"`
	Status     string `json:"status"`
}
