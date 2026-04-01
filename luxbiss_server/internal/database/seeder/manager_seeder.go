package seeder

import (

	"github.com/google/uuid"
	"github.com/parvej/luxbiss_server/internal/modules/manager"
	"gorm.io/gorm"
)

type ManagerSeeder struct{}

func (s *ManagerSeeder) Seed(db *gorm.DB) error {
	managers := []manager.Manager{
		{
			Name:             "Sarah Jenkins",
			TelegramUsername: "sarah_luxbiss",
			ProfilePhoto:     "https://i.pravatar.cc/150?u=sarah",
		},
		{
			Name:             "Michael Chen",
			TelegramUsername: "michael_luxbiss",
			ProfilePhoto:     "https://i.pravatar.cc/150?u=michael",
		},
	}

	for _, m := range managers {
		var existing manager.Manager
		if err := db.Where("name = ?", m.Name).First(&existing).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				m.ID = uuid.New().String()
				if err := db.Create(&m).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}
	}

	return nil
}
