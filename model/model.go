package model

import (
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

type Class struct {
	ClassID     string `json:"class_id" gorm:"column:class_id;primaryKey;type:varchar(20)"`   // 主键，映射SQL ClassID字段，指定字段类型
	ClassName   string `json:"class_name" gorm:"column:class_name;type:varchar(50);not null"` // 非空约束，映射SQL ClassName字段
	Grade       string `json:"grade" gorm:"column:grade;type:char(4)"`                        // 映射SQL Grade字段，指定char(4)类型，年级
	Major       string `json:"major" gorm:"column:major;type:varchar(50)"`                    // 映射SQL Major字段
	CounselorID string `json:"counselor_id" gorm:"column:counselor_id;type:varchar(20)"`      // 映射SQL CounselorID字段（辅导员ID）
	MemberCount int    `json:"member_count" gorm:"column:member_count;type:int;default:0"`    // 映射SQL MemberCount字段，默认值0
}

type User struct {
	UserID     string    `json:"user_id" gorm:"column:user_id;primaryKey;type:varchar(26)"`
	SchoolNum  string    `json:"school_num" gorm:"column:school_num;type:varchar(20)"`                                          // 唯一约束，映射SQL SchoolNum字段
	Name       string    `json:"name" gorm:"column:name;type:varchar(20);not null"`                                             // 非空约束，映射SQL Name字段
	Password   string    `json:"password" gorm:"column:password;type:varchar(50);not null"`                                     // 非空约束，映射SQL Password字段
	Phone      string    `json:"phone" gorm:"column:phone;type:varchar(20)"`                                                    // 映射SQL Phone字段
	Email      string    `json:"email" gorm:"column:email;type:varchar(50)"`                                                    // 映射SQL Email字段
	Status     int       `json:"status" gorm:"column:status;type:int;default:1"`                                                // 映射SQL Status字段，默认值1（账号正常）
	Role       string    `json:"role" gorm:"column:role;type:varchar(20)"`                                                      // 映射SQL Role字段（成员职位）
	ClassID    string    `json:"class_id" gorm:"column:class_id;type:varchar(20);foreignKey:ClassID;references:Class(ClassID)"` // 外键关联，映射SQL ClassID字段
	CreateTime time.Time `json:"create_time" gorm:"column:create_time;default:CURRENT_TIMESTAMP"`                               // 映射SQL CreateTime字段，默认当前时间
}

func (u *User) AfterCreate(tx *gorm.DB) (err error) {
	err = tx.Model(&Class{}).Where("class_name = ?", u.ClassID).
		UpdateColumn("member_count", gorm.Expr("member_count + ?", 1)).Error
	if err != nil {
		log.Println(err)
	}
	return
}

func (u *User) AfterDelete(tx *gorm.DB) (err error) {
	err = tx.Model(&Class{}).
		Where("class_name = ?", u.ClassID).
		UpdateColumn("member_count", gorm.Expr("member_count - ?", 1)).
		Error

	if err != nil {
		log.Printf("用户删除后更新班级人数失败：%v", err)
		return
	}
	return
}

type Activity struct {
	// 主键字段（对应ActivityID INT PRIMARY KEY IDENTITY(1,1)）
	ActivityID  int       `gorm:"primaryKey;autoIncrement" json:"activityId"` // SQL Server自增用autoIncrement，MySQL同理
	Name        string    `gorm:"size:100" json:"name"`                       // 对应Name VARCHAR(100)
	Description string    `json:"description"`
	StartTime   time.Time `json:"startTime"`                        // 对应StartTime DATETIME
	EndTime     time.Time `json:"endTime"`                          // 对应EndTime DATETIME
	SignupStart time.Time `json:"signupStart"`                      // 对应SignupStart DATETIME
	SignupEnd   time.Time `json:"signupEnd"`                        // 对应SignupEnd DATETIME
	Location    string    `gorm:"size:100" json:"location"`         // 对应Location VARCHAR(100)
	Budget      float64   `gorm:"type:decimal(10,2)" json:"budget"` // 对应Budget DECIMAL(10,2)
	LeaderID    string    `gorm:"size:20" json:"leaderId"`          // 对应LeaderID VARCHAR(20)
	Status      string    `gorm:"size:20" json:"status"`            // 对应Status VARCHAR(20)
	MaxPeople   int       `json:"maxPeople"`                        // 对应MaxPeople INT

	Leader User `gorm:"foreignKey:LeaderID;references:UserID" json:"-"`
	// GORM默认字段（若需要，可以添加，对应created_at/updated_at/deleted_at）
	CreatedAt time.Time      `json:"-"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"` // 软删除字段
}
type Signup struct {
	ID uint `gorm:"primaryKey" json:"id"`

	ActivityID uint   `gorm:"uniqueIndex:idx_user_activity;not null" json:"activityId"`
	UserID     string `gorm:"size:32;uniqueIndex:idx_user_activity;not null" json:"userId"`

	Status     string    `gorm:"size:20;default:'signed'" json:"status"`
	SignupTime time.Time `gorm:"autoCreateTime" json:"signupTime"`

	User     User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Activity Activity `gorm:"foreignKey:ActivityID" json:"activity,omitempty"`
}

func (s *Signup) BeforeCreate(tx *gorm.DB) error {
	var activity Activity
	err := tx.Model(&Activity{}).Where("activity_id = ?", int(s.ActivityID)).First(&activity).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("校验失败：对应的活动不存在")
		}
		return errors.New("查询活动信息失败：" + err.Error())
	}
	if activity.Status != "active" {
		return errors.New("校验失败：该活动未处于可报名状态，无法新增报名")
	}

	now := time.Now()
	if now.After(activity.EndTime) {
		return errors.New("校验失败：该活动已结束，无法新增报名")
	}

	var signedCount int64
	err = tx.Model(&Signup{}).Where("activity_id = ?", int(s.ActivityID)).Count(&signedCount).Error
	if err != nil {
		return errors.New("统计已报名人数失败：" + err.Error())
	}
	if signedCount >= int64(activity.MaxPeople) {
		return errors.New(
			"校验失败：该活动已报满（最大可报名人数：" + string(rune(activity.MaxPeople)) +
				"，当前已报名人数：" + string(rune(signedCount)) + "）",
		)
	}

	return nil
}
