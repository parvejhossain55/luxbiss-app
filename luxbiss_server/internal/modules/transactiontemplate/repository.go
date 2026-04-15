package transactiontemplate

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/parvej/luxbiss_server/internal/common"
	"gorm.io/gorm"
)

type GormRepository struct {
	db *gorm.DB
}

func NewGormRepository(db *gorm.DB) *GormRepository {
	return &GormRepository{db: db}
}

func (r *GormRepository) Create(ctx context.Context, template *Template) error {
	template.ID = uuid.New().String()
	return r.db.WithContext(ctx).Create(template).Error
}

func (r *GormRepository) GetByID(ctx context.Context, id string) (*Template, error) {
	var template Template
	result := r.db.WithContext(ctx).Where("id = ?", id).First(&template)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, common.ErrNotFound("Transaction template")
		}
		return nil, result.Error
	}

	return &template, nil
}

func (r *GormRepository) List(ctx context.Context) ([]*Template, error) {
	var templates []*Template
	if err := r.db.WithContext(ctx).Order("created_at DESC").Find(&templates).Error; err != nil {
		return nil, err
	}
	return templates, nil
}

func (r *GormRepository) Update(ctx context.Context, template *Template) error {
	result := r.db.WithContext(ctx).Model(template).Updates(map[string]interface{}{
		"date":   template.Date,
		"amount": template.Amount,
		"type":   template.Type,
		"note":   template.Note,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return common.ErrNotFound("Transaction template")
	}
	return nil
}

func (r *GormRepository) Delete(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Where("id = ?", id).Delete(&Template{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return common.ErrNotFound("Transaction template")
	}
	return nil
}
