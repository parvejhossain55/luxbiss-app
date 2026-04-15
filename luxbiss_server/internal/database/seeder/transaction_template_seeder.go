package seeder

import (
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/parvej/luxbiss_server/internal/modules/transactiontemplate"
	"gorm.io/gorm"
)

type TransactionTemplateSeeder struct{}

func (s *TransactionTemplateSeeder) Seed(db *gorm.DB) error {
	parseDate := func(value string) time.Time {
		t, err := time.Parse("01.02 03:04 PM", value)
		if err != nil {
			return time.Now().UTC()
		}
		return time.Date(2025, t.Month(), t.Day(), t.Hour(), t.Minute(), 0, 0, time.UTC)
	}

	templates := []transactiontemplate.Template{
		{
			ID:     uuid.New().String(),
			Date:   parseDate("04.07 11:06 AM"),
			Amount: 31000,
			Type:   transactiontemplate.TypeWithdraw,
			Note:   "Withdrawal via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("04.02 04:22 PM"),
			Amount: 25000,
			Type:   transactiontemplate.TypeDeposit,
			Note:   "Deposit via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("03.29 12:58 PM"),
			Amount: 30000,
			Type:   transactiontemplate.TypeWithdraw,
			Note:   "Withdrawal via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("03.26 10:32 AM"),
			Amount: 24000,
			Type:   transactiontemplate.TypeDeposit,
			Note:   "Deposit via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("03.23 12:16 PM"),
			Amount: 20000,
			Type:   transactiontemplate.TypeWithdraw,
			Note:   "Withdrawal via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("03.19 06:27 PM"),
			Amount: 17000,
			Type:   transactiontemplate.TypeDeposit,
			Note:   "Deposit via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("03.16 08:53 AM"),
			Amount: 11000,
			Type:   transactiontemplate.TypeWithdraw,
			Note:   "Withdrawal via USDT (TRX Tron (TRC20))",
		},
		{
			ID:     uuid.New().String(),
			Date:   parseDate("03.10 02:26 PM"),
			Amount: 14000,
			Type:   transactiontemplate.TypeDeposit,
			Note:   "Deposit via USDT (TRX Tron (TRC20))",
		},
	}

	for _, template := range templates {
		var existing transactiontemplate.Template
		err := db.Where(
			"date = ? AND amount = ? AND type = ? AND note = ?",
			template.Date,
			template.Amount,
			template.Type,
			template.Note,
		).First(&existing).Error

		if err == nil {
			continue
		}

		if err != gorm.ErrRecordNotFound {
			return err
		}

		if err := db.Create(&template).Error; err != nil {
			return err
		}

		log.Printf("Seeded transaction template: %s %s", template.Type, template.Date.Format(time.RFC3339))
	}

	return nil
}
