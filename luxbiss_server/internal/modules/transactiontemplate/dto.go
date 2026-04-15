package transactiontemplate

import "time"

type CreateTemplateRequest struct {
	Date   time.Time `json:"date" validate:"required"`
	Amount float64   `json:"amount" validate:"required,gt=0"`
	Type   string    `json:"type" validate:"required,oneof=deposit withdraw"`
	Note   string    `json:"note" validate:"omitempty,min=3,max=1000"`
}

type UpdateTemplateRequest struct {
	Date   *time.Time `json:"date" validate:"omitempty"`
	Amount *float64   `json:"amount" validate:"omitempty,gt=0"`
	Type   *string    `json:"type" validate:"omitempty,oneof=deposit withdraw"`
	Note   *string    `json:"note" validate:"omitempty,min=3,max=1000"`
}

type TemplateResponse struct {
	ID        string  `json:"id"`
	Date      string  `json:"date"`
	Amount    float64 `json:"amount"`
	Type      string  `json:"type"`
	Note      string  `json:"note"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
}

func ToResponse(t *Template) *TemplateResponse {
	return &TemplateResponse{
		ID:        t.ID,
		Date:      t.Date.Format(time.RFC3339),
		Amount:    t.Amount,
		Type:      t.Type,
		Note:      t.Note,
		CreatedAt: t.CreatedAt.Format("2006-01-02T15:04:05Z"),
		UpdatedAt: t.UpdatedAt.Format("2006-01-02T15:04:05Z"),
	}
}

func ToResponseList(templates []*Template) []*TemplateResponse {
	responses := make([]*TemplateResponse, len(templates))
	for i, template := range templates {
		responses[i] = ToResponse(template)
	}
	return responses
}
