package database

import (
	"fmt"

	"gorm.io/gorm"
)

// NormalizeTransactionTemplateDateColumn converts legacy string dates like
// "03.29 12:58 PM" into timestamptz before GORM attempts AutoMigrate.
func NormalizeTransactionTemplateDateColumn(db *gorm.DB) error {
	var exists bool
	if err := db.Raw(`
		SELECT EXISTS (
			SELECT 1
			FROM information_schema.columns
			WHERE table_name = 'transaction_templates'
			  AND column_name = 'date'
		)
	`).Scan(&exists).Error; err != nil {
		return fmt.Errorf("check transaction_templates.date column: %w", err)
	}

	if !exists {
		return nil
	}

	var dataType string
	if err := db.Raw(`
		SELECT data_type
		FROM information_schema.columns
		WHERE table_name = 'transaction_templates'
		  AND column_name = 'date'
		LIMIT 1
	`).Scan(&dataType).Error; err != nil {
		return fmt.Errorf("read transaction_templates.date type: %w", err)
	}

	if dataType != "character varying" && dataType != "text" {
		return nil
	}

	if err := db.Exec(`
		ALTER TABLE "transaction_templates"
		ALTER COLUMN "date" TYPE timestamptz
		USING CASE
			WHEN trim("date") = '' THEN NOW()
			ELSE to_timestamp(
				EXTRACT(YEAR FROM NOW())::text || '.' || "date",
				'YYYY.MM.DD HH12:MI AM'
			)
		END
	`).Error; err != nil {
		return fmt.Errorf("convert transaction_templates.date to timestamptz: %w", err)
	}

	return nil
}
