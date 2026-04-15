package user

import (
	"context"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/parvej/luxbiss_server/internal/common"
	"github.com/parvej/luxbiss_server/internal/logger"
	"github.com/parvej/luxbiss_server/internal/modules/transactiontemplate"
	"github.com/parvej/luxbiss_server/pkg/hash"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type UserService struct {
	repo                 Repository
	transactionTemplates transactiontemplate.Repository
	log                  *logger.Logger
	rdb                  *redis.Client
}

func NewService(repo Repository, templateRepo transactiontemplate.Repository, log *logger.Logger, rdb *redis.Client) *UserService {
	return &UserService{repo: repo, transactionTemplates: templateRepo, log: log, rdb: rdb}
}

func (s *UserService) Create(ctx context.Context, req *CreateUserRequest) (*User, error) {
	existing, _ := s.repo.GetByEmail(ctx, strings.ToLower(req.Email))
	if existing != nil {
		return nil, common.ErrConflict("A user with this email already exists")
	}

	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		s.log.Errorw("Failed to hash password", "error", err)
		return nil, common.ErrInternal(err)
	}

	user := &User{
		Name:         req.Name,
		Email:        strings.ToLower(req.Email),
		Password:     hashedPassword,
		Role:         req.Role,
		ProfilePhoto: req.ProfilePhoto,
	}

	if err := s.repo.Create(ctx, user); err != nil {
		s.log.Errorw("Failed to create user", "error", err, "email", req.Email)
		return nil, common.ErrInternal(err)
	}

	s.log.Infow("User created successfully", "user_id", user.ID, "email", user.Email)
	return user, nil
}

func (s *UserService) GetByID(ctx context.Context, id string) (*User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) GetByEmail(ctx context.Context, email string) (*User, error) {
	user, err := s.repo.GetByEmail(ctx, strings.ToLower(email))
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserService) List(ctx context.Context, status string, limit, offset int) ([]*User, int64, error) {
	return s.repo.List(ctx, status, limit, offset)
}

func (s *UserService) Update(ctx context.Context, id string, req *UpdateUserRequest) (*User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Email != "" {
		user.Email = strings.ToLower(req.Email)
	}
	if req.Role != nil {
		user.Role = *req.Role
	}

	shouldInvalidateTokens := false
	if req.Status != nil && user.Status != *req.Status {
		user.Status = *req.Status
		if *req.Status != "active" {
			shouldInvalidateTokens = true
		}
	}

	if req.Password != nil {
		hashed, err := hash.HashPassword(*req.Password)
		if err == nil {
			user.Password = hashed
			shouldInvalidateTokens = true
		}
	}

	if req.ProfilePhoto != nil {
		user.ProfilePhoto = *req.ProfilePhoto
	}
	if req.Balance != nil {
		user.Balance = *req.Balance
	}
	if req.HoldBalance != nil {
		user.HoldBalance = *req.HoldBalance
	}
	if req.WithdrawableBalance != nil {
		user.WithdrawableBalance = *req.WithdrawableBalance
	}
	if req.DateOfBirth != nil {
		user.DateOfBirth = *req.DateOfBirth
	}
	if req.Gender != nil {
		user.Gender = *req.Gender
	}
	if req.Phone != nil {
		user.Phone = *req.Phone
	}
	if req.Address != nil {
		user.Address = *req.Address
	}
	if req.Country != nil {
		user.Country = *req.Country
	}
	if req.PaymentMethod != nil {
		user.PaymentMethod = *req.PaymentMethod
	}
	if req.PaymentCurrency != nil {
		user.PaymentCurrency = *req.PaymentCurrency
	}
	if req.PaymentNetwork != nil {
		user.PaymentNetwork = *req.PaymentNetwork
	}
	if req.WithdrawalAddress != nil {
		user.WithdrawalAddress = *req.WithdrawalAddress
	}
	if req.LevelID != nil || req.StepID != nil {
		if req.LevelID != nil {
			user.LevelID = req.LevelID
		}
		if req.StepID != nil {
			user.StepID = req.StepID
		}
		user.CurrentStepCompleted = false
	}
	if req.CurrentStepCompleted != nil {
		user.CurrentStepCompleted = *req.CurrentStepCompleted
	}

	if err := s.repo.Update(ctx, user); err != nil {
		s.log.Errorw("Failed to update user", "error", err, "user_id", id)
		return nil, common.ErrInternal(err)
	}

	if shouldInvalidateTokens {
		s.InvalidateAllUserSessions(ctx, id)
	}

	s.log.Infow("User updated successfully", "user_id", id)
	return user, nil
}

func (s *UserService) UpdateBalance(ctx context.Context, userID string, amount float64) error {
	if err := s.repo.UpdateBalance(ctx, userID, amount); err != nil {
		s.log.Errorw("Failed to update user balance", "error", err, "user_id", userID, "amount", amount)
		return common.ErrInternal(err)
	}
	s.log.Infow("User balance updated successfully", "user_id", userID, "amount", amount)
	return nil
}

func (s *UserService) UpdateHoldBalance(ctx context.Context, userID string, amount float64) error {
	if err := s.repo.UpdateHoldBalance(ctx, userID, amount); err != nil {
		s.log.Errorw("Failed to update user hold balance", "error", err, "user_id", userID, "amount", amount)
		return common.ErrInternal(err)
	}
	s.log.Infow("User hold balance updated successfully", "user_id", userID, "amount", amount)
	return nil
}

func (s *UserService) UpdateWithdrawableBalance(ctx context.Context, userID string, amount float64) error {
	if err := s.repo.UpdateWithdrawableBalance(ctx, userID, amount); err != nil {
		s.log.Errorw("Failed to update user withdrawable balance", "error", err, "user_id", userID, "amount", amount)
		return common.ErrInternal(err)
	}
	s.log.Infow("User withdrawable balance updated successfully", "user_id", userID, "amount", amount)
	return nil
}

func (s *UserService) UpdatePassword(ctx context.Context, id string, hashedPassword string) error {
	if err := s.repo.UpdatePassword(ctx, id, hashedPassword); err != nil {
		s.log.Errorw("Failed to update user password", "error", err, "user_id", id)
		return common.ErrInternal(err)
	}

	s.InvalidateAllUserSessions(ctx, id)
	s.log.Infow("User password updated successfully", "user_id", id)
	return nil
}

func (s *UserService) InvalidateAllUserSessions(ctx context.Context, userID string) {
	// 1. Invalidate Refresh Token (to prevent get new access token)
	s.rdb.Del(ctx, "refresh_token:"+userID)

	// 2. Set key to invalidate current access tokens (Access Token TTL is usually 1m-5m)
	// We set this key for 5 minutes just to be sure all current access tokens are invalidated
	revokedKey := "revoked_user:" + userID
	_ = s.rdb.Set(ctx, revokedKey, "1", 5*time.Minute).Err()
}

func (s *UserService) ApproveHoldBalance(ctx context.Context, id string) (*User, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if user.HoldBalance <= 0 {
		return nil, common.ErrBadRequest("User has no hold balance to approve")
	}

	amount := user.HoldBalance
	user.Balance += amount
	user.HoldBalance = 0

	if err := s.repo.Update(ctx, user); err != nil {
		s.log.Errorw("Failed to approve hold balance", "error", err, "user_id", id)
		return nil, common.ErrInternal(err)
	}

	// Sync transactions
	if err := s.CompletePendingTransactions(ctx, id); err != nil {
		s.log.Errorw("Failed to sync transactions on hold balance approval", "error", err, "user_id", id)
		// We don't return error here because the balance itself was already updated
	}

	s.log.Infow("User hold balance approved successfully", "user_id", id, "amount", amount)
	return user, nil
}

func (s *UserService) InsertTemplateTransactions(ctx context.Context, id string) (*InsertTemplateTransactionsResponse, error) {
	user, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if user.Status != StatusIgnored {
		return nil, common.ErrBadRequest("Template transactions can only be inserted for ignored users")
	}

	templates, err := s.transactionTemplates.List(ctx)
	if err != nil {
		s.log.Errorw("Failed to list transaction templates", "error", err, "user_id", id)
		return nil, common.ErrInternal(err)
	}

	if len(templates) == 0 {
		return &InsertTemplateTransactionsResponse{Inserted: 0, Skipped: 0}, nil
	}

	sort.Slice(templates, func(i, j int) bool {
		return templates[i].Date.Before(templates[j].Date)
	})

	db := s.repo.DB().(*gorm.DB)
	result := &InsertTemplateTransactionsResponse{}

	err = db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, template := range templates {
			var existingCount int64
			if err := tx.Table("transactions").
				Where("user_id = ? AND type = ? AND amount = ? AND note = ? AND created_at = ?",
					user.ID, template.Type, template.Amount, template.Note, template.Date).
				Count(&existingCount).Error; err != nil {
				return err
			}

			if existingCount > 0 {
				result.Skipped++
				continue
			}

			txType := template.Type
			if txType == transactiontemplate.TypeWithdraw {
				txType = "withdraw"
			}

			record := map[string]interface{}{
				"id":            uuid.New().String(),
				"user_id":       user.ID,
				"type":          txType,
				"amount":        template.Amount,
				"profit_amount": 0,
				"status":        "completed",
				"tx_hash":       common.GenerateHash(),
				"note":          template.Note,
				"created_at":    template.Date,
				"updated_at":    template.Date,
			}

			if err := tx.Table("transactions").Create(record).Error; err != nil {
				return err
			}

			result.Inserted++
		}

		if result.Inserted == 0 {
			return nil
		}

		return nil
	})
	if err != nil {
		s.log.Errorw("Failed to insert template transactions", "error", err, "user_id", id)
		return nil, common.ErrInternal(err)
	}

	s.log.Infow("Inserted template transactions for ignored user", "user_id", id, "inserted", result.Inserted, "skipped", result.Skipped)
	return result, nil
}

func (s *UserService) CompletePendingTransactions(ctx context.Context, userID string) error {
	return s.repo.CompletePendingTransactions(ctx, userID)
}

func (s *UserService) Delete(ctx context.Context, id string) error {
	if err := s.DeleteUserRelatedData(ctx, id); err != nil {
		s.log.Errorw("Failed to delete user related data", "error", err, "user_id", id)
		return common.ErrInternal(err)
	}

	if err := s.repo.Delete(ctx, id); err != nil {
		return err
	}
	s.log.Infow("User deleted successfully", "user_id", id)
	return nil
}

func (s *UserService) DeleteUserRelatedData(ctx context.Context, userID string) error {
	if err := s.deleteTransactions(ctx, userID); err != nil {
		return err
	}

	if err := s.deleteGiftcards(ctx, userID); err != nil {
		return err
	}

	s.rdb.Del(ctx, "refresh_token:"+userID)
	revokedKey := "revoked_user:" + userID
	_ = s.rdb.Del(ctx, revokedKey)

	s.log.Infow("User related data deleted successfully", "user_id", userID)
	return nil
}

func (s *UserService) deleteTransactions(ctx context.Context, userID string) error {
	db := s.repo.DB().(*gorm.DB)
	result := db.WithContext(ctx).Exec("DELETE FROM transactions WHERE user_id = ?", userID)
	if result.Error != nil {
		return result.Error
	}
	s.log.Infow("Deleted user transactions", "user_id", userID, "count", result.RowsAffected)
	return nil
}

func (s *UserService) deleteGiftcards(ctx context.Context, userID string) error {
	db := s.repo.DB().(*gorm.DB)
	result := db.WithContext(ctx).Exec("DELETE FROM giftcards WHERE user_id = ?", userID)
	if result.Error != nil {
		return result.Error
	}
	s.log.Infow("Deleted user giftcards", "user_id", userID, "count", result.RowsAffected)
	return nil
}

func (s *UserService) AdvanceUsersToNextStep(ctx context.Context, levelID, currentStepID, nextLevelID, nextStepID uint) error {
	if err := s.repo.AdvanceUsersToNextStep(ctx, levelID, currentStepID, nextLevelID, nextStepID); err != nil {
		s.log.Errorw("Failed to advance users to next step", "error", err, "level_id", levelID, "current_step_id", currentStepID, "next_step_id", nextStepID, "next_level_id", nextLevelID)
		return common.ErrInternal(err)
	}
	s.log.Infow("Advanced users to next step", "level_id", levelID, "current_step_id", currentStepID, "next_step_id", nextStepID, "next_level_id", nextLevelID)
	return nil
}
