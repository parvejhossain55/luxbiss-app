package transactiontemplate

import (
	"context"
	"fmt"

	"github.com/parvej/luxbiss_server/internal/common"
	"github.com/parvej/luxbiss_server/internal/logger"
)

type TemplateService struct {
	repo Repository
	log  *logger.Logger
}

func NewService(repo Repository, log *logger.Logger) *TemplateService {
	return &TemplateService{repo: repo, log: log}
}

func (s *TemplateService) Create(ctx context.Context, req *CreateTemplateRequest) (*Template, error) {
	notes := map[string]string{
		"withdraw": "Withdrawal",
		"deposit":  "Deposit",
	}

	template := &Template{
		Date:   req.Date,
		Amount: req.Amount,
		Type:   req.Type,
		Note:   fmt.Sprintf("%s via USDT (TRX Tron (TRC20))", notes[req.Type]),
	}

	if err := s.repo.Create(ctx, template); err != nil {
		s.log.Errorw("Failed to create transaction template", "error", err)
		return nil, common.ErrInternal(err)
	}

	return template, nil
}

func (s *TemplateService) List(ctx context.Context) ([]*Template, error) {
	return s.repo.List(ctx)
}

func (s *TemplateService) Update(ctx context.Context, id string, req *UpdateTemplateRequest) (*Template, error) {
	template, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	notes := map[string]string{
		"withdraw": "Withdrawal",
		"deposit":  "Deposit",
	}

	if req.Date != nil {
		template.Date = *req.Date
	}
	if req.Amount != nil {
		template.Amount = *req.Amount
	}
	if req.Type != nil {
		template.Type = *req.Type
	}
	if req.Note != nil {
		template.Note = fmt.Sprintf("%s via USDT (TRX Tron (TRC20))", notes[*req.Type])
	}

	if err := s.repo.Update(ctx, template); err != nil {
		s.log.Errorw("Failed to update transaction template", "error", err, "template_id", id)
		if _, ok := common.IsAppError(err); ok {
			return nil, err
		}
		return nil, common.ErrInternal(err)
	}

	return template, nil
}

func (s *TemplateService) Delete(ctx context.Context, id string) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		s.log.Errorw("Failed to delete transaction template", "error", err, "template_id", id)
		if _, ok := common.IsAppError(err); ok {
			return err
		}
		return common.ErrInternal(err)
	}

	return nil
}
