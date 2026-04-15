package validators

import (
	"regexp"
)

// PasswordStrength represents the strength level of a password
type PasswordStrength int

const (
	Weak PasswordStrength = iota
	Medium
	Strong
)

// PasswordValidationResult contains the result of password validation
type PasswordValidationResult struct {
	IsValid  bool
	Strength PasswordStrength
	Errors   []string
	Score    int
}

// ValidatePassword validates password strength and returns detailed results
func ValidatePassword(password string) *PasswordValidationResult {
	result := &PasswordValidationResult{
		IsValid: true,
		Errors:  []string{},
		Score:   0,
	}

	// Length validation
	if len(password) < 8 {
		result.IsValid = false
		result.Errors = append(result.Errors, "Password must be at least 8 characters long")
	} else if len(password) >= 8 {
		result.Score += 1
	}

	if len(password) >= 12 {
		result.Score += 1
	}

	// Character type validation
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`\d`).MatchString(password)
	hasSpecial := regexp.MustCompile(`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`).MatchString(password)

	if !hasLower {
		result.IsValid = false
		result.Errors = append(result.Errors, "Password must contain at least one lowercase letter")
	} else {
		result.Score += 1
	}

	if !hasUpper {
		result.IsValid = false
		result.Errors = append(result.Errors, "Password must contain at least one uppercase letter")
	} else {
		result.Score += 1
	}

	if !hasNumber {
		result.IsValid = false
		result.Errors = append(result.Errors, "Password must contain at least one number")
	} else {
		result.Score += 1
	}

	if !hasSpecial {
		result.IsValid = false
		result.Errors = append(result.Errors, "Password must contain at least one special character")
	} else {
		result.Score += 1
	}

	// Determine strength
	if result.Score >= 6 {
		result.Strength = Strong
	} else if result.Score >= 4 {
		result.Strength = Medium
	} else {
		result.Strength = Weak
	}

	return result
}
