package transactiontemplate

import (
	"context"
	"time"

	"gorm.io/gorm"
)

const (
	TypeDeposit  = "deposit"
	TypeWithdraw = "withdraw"
)

type Template struct {
	ID        string         `json:"id" gorm:"type:varchar(36);primaryKey"`
	Date      time.Time      `json:"date" gorm:"not null;index"`
	Amount    float64        `json:"amount" gorm:"type:decimal(15,2);not null"`
	Type      string         `json:"type" gorm:"type:varchar(20);not null"`
	Note      string         `json:"note" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

func (Template) TableName() string {
	return "transaction_templates"
}

type Repository interface {
	Create(ctx context.Context, template *Template) error
	GetByID(ctx context.Context, id string) (*Template, error)
	List(ctx context.Context) ([]*Template, error)
	Update(ctx context.Context, template *Template) error
	Delete(ctx context.Context, id string) error
}

type Service interface {
	Create(ctx context.Context, req *CreateTemplateRequest) (*Template, error)
	List(ctx context.Context) ([]*Template, error)
	Update(ctx context.Context, id string, req *UpdateTemplateRequest) (*Template, error)
	Delete(ctx context.Context, id string) error
}
