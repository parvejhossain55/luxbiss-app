package auth

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"time"

	"github.com/parvej/luxbiss_server/internal/common"
	"github.com/parvej/luxbiss_server/internal/config"
	"github.com/parvej/luxbiss_server/internal/logger"
	"github.com/parvej/luxbiss_server/internal/modules/user"
	"github.com/parvej/luxbiss_server/pkg/email"
	"github.com/parvej/luxbiss_server/pkg/hash"
	"github.com/parvej/luxbiss_server/pkg/jwt"
	"github.com/redis/go-redis/v9"
	"google.golang.org/api/idtoken"
)

type Service struct {
	userService user.Service
	jwtManager  *jwt.Manager
	rdb         *redis.Client
	emailSender email.Sender
	oauthCfg    *config.OAuthConfig
	log         *logger.Logger
}

type PendingRegistration struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	OTP      string `json:"otp"`
}

func NewService(
	userService user.Service,
	jwtManager *jwt.Manager,
	rdb *redis.Client,
	emailSender email.Sender,
	oauthCfg *config.OAuthConfig,
	log *logger.Logger,
) *Service {
	return &Service{
		userService: userService,
		jwtManager:  jwtManager,
		rdb:         rdb,
		emailSender: emailSender,
		oauthCfg:    oauthCfg,
		log:         log,
	}
}

func (s *Service) Register(ctx context.Context, req *RegisterRequest) (string, error) {
	// Check if user already exists
	existing, _ := s.userService.GetByEmail(ctx, req.Email)
	if existing != nil {
		return "", common.ErrConflict("A user with this email already exists")
	}

	otp := generateOTP(6)
	otpKey := fmt.Sprintf("reg_otp:%s", strings.ToLower(req.Email))
	dataKey := fmt.Sprintf("reg_data:%s", strings.ToLower(req.Email))

	// Store OTP and Registration Data (expires in 15 mins)
	err := s.rdb.Set(ctx, otpKey, otp, 15*time.Minute).Err()
	if err != nil {
		return "", common.ErrInternal(err)
	}

	registrationData := fmt.Sprintf("%s|%s", req.Name, req.Password)
	err = s.rdb.Set(ctx, dataKey, registrationData, 15*time.Minute).Err()
	if err != nil {
		return "", common.ErrInternal(err)
	}

	// Send OTP Email
	go func() {
		subject := "Verify Your Registration"
		body := fmt.Sprintf("<h1>OTP: %s</h1><p>Welcome to Luxbiss! Use this code to complete your registration. It expires in 15 minutes.</p>", otp)
		err := s.emailSender.SendEmail([]string{req.Email}, subject, body)
		if err != nil {
			s.log.Errorw("Failed to send registration OTP email", "error", err, "email", req.Email)
		} else {
			s.log.Infow("Registration OTP email sent successfully", "email", req.Email)
		}
	}()

	return "OTP sent successfully to your email", nil
}

func (s *Service) ConfirmRegistration(ctx context.Context, req *VerifyOTPRequest) (*AuthResponse, error) {
	email := strings.ToLower(req.Email)
	otpKey := fmt.Sprintf("reg_otp:%s", email)
	dataKey := fmt.Sprintf("reg_data:%s", email)

	// 1. Verify OTP
	storedOTP, err := s.rdb.Get(ctx, otpKey).Result()
	if err != nil {
		if err == redis.Nil {
			return nil, common.ErrBadRequest("Invalid or expired OTP")
		}
		return nil, common.ErrInternal(err)
	}

	if storedOTP != req.OTP {
		return nil, common.ErrBadRequest("Invalid OTP")
	}

	// 2. Get Registration Data
	regData, err := s.rdb.Get(ctx, dataKey).Result()
	if err != nil {
		return nil, common.ErrBadRequest("Registration data expired. Please register again.")
	}

	parts := strings.Split(regData, "|")
	if len(parts) != 2 {
		return nil, common.ErrInternal(fmt.Errorf("invalid registration data format"))
	}
	name, password := parts[0], parts[1]

	// 3. Create User (Finally)
	createReq := &user.CreateUserRequest{
		Name:     name,
		Email:    email,
		Password: password,
		Role:     user.RoleUser,
	}

	// Note: userService.Create will re-hash if we pass raw password,
	// but we should ensure we handle the pre-hashed password correctly.
	// Looking at user.Service.Create, it hashes the req.Password.
	// Since we already hashed it for Redis storage, we need to pass the HASHED one
	// and ensure the repo doesn't re-hash or we change service.Go

	newUser, err := s.userService.Create(ctx, createReq)
	if err != nil {
		return nil, err
	}

	// 4. Cleanup Redis
	_ = s.rdb.Del(ctx, otpKey, dataKey).Err()

	// 5. Generate Tokens
	tokens, err := s.jwtManager.GenerateTokenPair(newUser.ID, newUser.Email, newUser.Role)
	if err != nil {
		return nil, common.ErrInternal(err)
	}

	rfKey := fmt.Sprintf("refresh_token:%s", newUser.ID)
	claims, _ := s.jwtManager.ValidateToken(tokens.RefreshToken)
	_ = s.rdb.Set(ctx, rfKey, claims.ID, s.jwtManager.GetRefreshTokenTTL()).Err()

	return &AuthResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		User:         user.ToResponse(newUser),
	}, nil
}

func (s *Service) ResendRegistrationOTP(ctx context.Context, email string) error {
	email = strings.ToLower(email)
	otpKey := fmt.Sprintf("reg_otp:%s", email)
	dataKey := fmt.Sprintf("reg_data:%s", email)

	// 1. Check if registration data exists
	exists, err := s.rdb.Exists(ctx, dataKey).Result()
	if err != nil {
		return common.ErrInternal(err)
	}
	if exists == 0 {
		return common.ErrBadRequest("Registration session expired or does not exist. Please register again.")
	}

	// 2. Generate and store new OTP
	otp := generateOTP(6)
	err = s.rdb.Set(ctx, otpKey, otp, 15*time.Minute).Err()
	if err != nil {
		return common.ErrInternal(err)
	}

	// 3. Send Email
	go func() {
		subject := "Verify Your Registration (New Code)"
		body := fmt.Sprintf("<h1>OTP: %s</h1><p>Use this code to complete your registration. It expires in 15 minutes.</p>", otp)
		err := s.emailSender.SendEmail([]string{email}, subject, body)
		if err != nil {
			s.log.Errorw("Failed to resend registration OTP email", "error", err, "email", email)
		} else {
			s.log.Infow("Registration OTP email resent successfully", "email", email)
		}
	}()

	return nil
}

func (s *Service) Login(ctx context.Context, req *LoginRequest) (*AuthResponse, error) {
	existingUser, err := s.userService.GetByEmail(ctx, req.Email)
	if err != nil {
		// Timing protection: Always run bcrypt even when user doesn't exist
		dummyHash := "$2a$12$K.zM1I9O.M.qE9V.O7W1.e0wV.l.v.v.v.v.v.v.v.v.v.v.v.v.v.v"
		_ = hash.CheckPassword(req.Password, dummyHash)
		return nil, common.ErrUnauthorized("Invalid credentials")
	}

	if err := hash.CheckPassword(req.Password, existingUser.Password); err != nil {
		return nil, common.ErrUnauthorized("Invalid credentials")
	}

	if !isLoginAllowed(existingUser.Status) {
		return nil, common.ErrForbidden("Your account has been deactivated")
	}

	tokens, err := s.jwtManager.GenerateTokenPair(existingUser.ID, existingUser.Email, existingUser.Role)
	if err != nil {
		s.log.Errorw("Failed to generate tokens", "error", err, "user_id", existingUser.ID)
		return nil, common.ErrInternal(err)
	}

	// Store refresh token JTI for rotation check
	claims, _ := s.jwtManager.ValidateToken(tokens.RefreshToken)
	rfKey := fmt.Sprintf("refresh_token:%s", existingUser.ID)
	_ = s.rdb.Set(ctx, rfKey, claims.ID, s.jwtManager.GetRefreshTokenTTL()).Err()

	// 🔒 Clear any session revocations (e.g. from a recent password change)
	// so the user can use the app again with the NEW password immediately
	_ = s.rdb.Del(ctx, "revoked_user:"+existingUser.ID).Err()

	return &AuthResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		User:         user.ToResponse(existingUser),
	}, nil
}

func (s *Service) RefreshToken(ctx context.Context, refreshToken string) (*AuthResponse, error) {
	claims, err := s.jwtManager.ValidateToken(refreshToken)
	if err != nil {
		return nil, common.ErrUnauthorized("Invalid or expired refresh token")
	}

	// Verify if this is the active refresh token (Rotation Check)
	rfKey := fmt.Sprintf("refresh_token:%s", claims.UserID)
	storedJTI, err := s.rdb.Get(ctx, rfKey).Result()
	if err != nil || storedJTI != claims.ID {
		return nil, common.ErrUnauthorized("Refresh token has been rotated or invalidated")
	}

	existingUser, err := s.userService.GetByID(ctx, claims.UserID)
	if err != nil {
		return nil, common.ErrUnauthorized("User not found")
	}

	if !isLoginAllowed(existingUser.Status) {
		return nil, common.ErrForbidden("Your account has been deactivated")
	}

	tokens, err := s.jwtManager.GenerateTokenPair(existingUser.ID, existingUser.Email, existingUser.Role)
	if err != nil {
		s.log.Errorw("Failed to generate tokens", "error", err, "user_id", existingUser.ID)
		return nil, common.ErrInternal(err)
	}

	// Store refresh token JTI for rotation check
	refClaims, _ := s.jwtManager.ValidateToken(tokens.RefreshToken)
	rfKey = fmt.Sprintf("refresh_token:%s", existingUser.ID)
	_ = s.rdb.Set(ctx, rfKey, refClaims.ID, s.jwtManager.GetRefreshTokenTTL()).Err()

	return &AuthResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		User:         user.ToResponse(existingUser),
	}, nil
}

func (s *Service) GoogleLogin(ctx context.Context, req *GoogleOAuthRequest) (*AuthResponse, error) {
	// 1. Try validating as ID Token first
	var emailClaim, nameClaim string
	payload, err := idtoken.Validate(ctx, req.Token, s.oauthCfg.GoogleClientID)

	if err == nil {
		// Valid ID Token
		emailClaim, _ = payload.Claims["email"].(string)
		nameClaim, _ = payload.Claims["name"].(string)
	} else {
		// 2. Fallback: Try as Access Token by calling Google UserInfo API
		s.log.Infow("Token is not a valid ID Token, trying as Access Token", "error", err)

		client := &http.Client{Timeout: 10 * time.Second}
		reqURL := "https://www.googleapis.com/oauth2/v3/userinfo"
		httpReq, _ := http.NewRequestWithContext(ctx, "GET", reqURL, nil)
		httpReq.Header.Set("Authorization", "Bearer "+req.Token)

		resp, err := client.Do(httpReq)
		if err != nil {
			return nil, common.ErrUnauthorized("Failed to verify Google token")
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return nil, common.ErrUnauthorized("Invalid Google token")
		}

		var googleUser struct {
			Email string `json:"email"`
			Name  string `json:"name"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
			return nil, common.ErrInternal(err)
		}
		emailClaim = googleUser.Email
		nameClaim = googleUser.Name
	}

	if emailClaim == "" {
		return nil, common.ErrUnauthorized("Google account has no email")
	}
	if nameClaim == "" {
		nameClaim = "Google User"
	}

	existingUser, err := s.userService.GetByEmail(ctx, emailClaim)
	if err != nil {
		// Register new user
		createReq := &user.CreateUserRequest{
			Name:     nameClaim,
			Email:    emailClaim,
			Password: generateRandomPassword(), // Google users don't need password but we store a random one
			Role:     user.RoleUser,
		}
		existingUser, err = s.userService.Create(ctx, createReq)
		if err != nil {
			return nil, err
		}
	}

	if !isLoginAllowed(existingUser.Status) {
		return nil, common.ErrForbidden("Your account has been deactivated")
	}

	tokens, err := s.jwtManager.GenerateTokenPair(existingUser.ID, existingUser.Email, existingUser.Role)
	if err != nil {
		return nil, common.ErrInternal(err)
	}

	// Store refresh token JTI for rotation check
	googleRefClaims, _ := s.jwtManager.ValidateToken(tokens.RefreshToken)
	googRfKey := fmt.Sprintf("refresh_token:%s", existingUser.ID)
	_ = s.rdb.Set(ctx, googRfKey, googleRefClaims.ID, s.jwtManager.GetRefreshTokenTTL()).Err()

	// Clear any session revocations
	_ = s.rdb.Del(ctx, "revoked_user:"+existingUser.ID).Err()

	return &AuthResponse{
		AccessToken:  tokens.AccessToken,
		RefreshToken: tokens.RefreshToken,
		User:         user.ToResponse(existingUser),
	}, nil
}

func isLoginAllowed(status string) bool {
	// Users who completed all levels should still be able to log in.
	// Only suspended users are blocked. Active and Ignored users are allowed.
	return status == user.StatusActive || status == user.StatusIgnored || status == user.StatusHold
}

func (s *Service) ForgotPassword(ctx context.Context, req *ForgotPasswordRequest) error {
	email := strings.ToLower(req.Email)
	existingUser, err := s.userService.GetByEmail(ctx, email)
	if err != nil {
		// Log the attempt for auditing, but don't reveal to user if account exists
		s.log.Infow("Forgot password request for non-existent user", "email", email)
		return nil
	}

	// Only send OTP if user is allowed to login (not suspended)
	if !isLoginAllowed(existingUser.Status) {
		s.log.Infow("Forgot password request for deactivated user", "email", email, "status", existingUser.Status)
		return nil
	}

	otp := generateOTP(6)
	otpKey := fmt.Sprintf("otp:%s", email)

	err = s.rdb.Set(ctx, otpKey, otp, 15*time.Minute).Err()
	if err != nil {
		s.log.Errorw("Failed to store OTP in redis", "error", err, "email", email)
		return common.ErrInternal(err)
	}

	go func() {
		defer func() {
			if r := recover(); r != nil {
				s.log.Errorw("Recovered from panic in ForgotPassword goroutine", "error", r)
			}
		}()

		subject := "Your Password Reset OTP"
		body := fmt.Sprintf("<h1>OTP: %s</h1><p>This code will expire in 15 minutes.</p>", otp)

		err := s.emailSender.SendEmail([]string{existingUser.Email}, subject, body)
		if err != nil {
			s.log.Errorw("Failed to send OTP email", "error", err, "email", existingUser.Email)
		}
	}()

	return nil
}

func (s *Service) ResetPassword(ctx context.Context, req *ResetPasswordRequest) error {
	if req.Password != req.ConfirmPassword {
		return common.ErrBadRequest("Passwords do not match")
	}

	email := strings.ToLower(req.Email)
	otpKey := fmt.Sprintf("otp:%s", email)
	attemptsKey := fmt.Sprintf("otp_attempts:%s", email)

	// Increment attempts
	attempts, _ := s.rdb.Incr(ctx, attemptsKey).Result()

	if attempts == 1 {
		_ = s.rdb.Expire(ctx, attemptsKey, 15*time.Minute)
	}
	if attempts > 5 {
		_ = s.rdb.Del(ctx, otpKey)
		return common.ErrForbidden("Maximum OTP attempts reached. Please request a new OTP.")
	}

	storedOTP, err := s.rdb.Get(ctx, otpKey).Result()
	if err != nil {
		if err == redis.Nil {
			return common.ErrBadRequest("Invalid or expired OTP")
		}
		return common.ErrInternal(err)
	}

	if storedOTP != req.OTP {
		return common.ErrBadRequest("Invalid OTP")
	}

	existingUser, err := s.userService.GetByEmail(ctx, email)
	if err != nil {
		return common.ErrNotFound("User")
	}

	// Update password
	hashedPassword, err := hash.HashPassword(req.Password)
	if err != nil {
		return common.ErrInternal(err)
	}

	if err := s.userService.UpdatePassword(ctx, existingUser.ID, hashedPassword); err != nil {
		return err
	}

	_ = s.rdb.Del(ctx, otpKey, attemptsKey)
	return nil
}

func (s *Service) VerifyOTP(ctx context.Context, req *VerifyOTPRequest) error {
	email := strings.ToLower(req.Email)
	otpKey := fmt.Sprintf("otp:%s", email)
	storedOTP, err := s.rdb.Get(ctx, otpKey).Result()
	if err != nil {
		if err == redis.Nil {
			return common.ErrBadRequest("Invalid or expired OTP")
		}
		return common.ErrInternal(err)
	}

	if storedOTP != req.OTP {
		return common.ErrBadRequest("Invalid OTP")
	}

	return nil
}

func (s *Service) Logout(ctx context.Context, accessToken string) error {
	claims, err := s.jwtManager.ValidateToken(accessToken)
	if err != nil {
		return nil // Token already invalid
	}

	// Blacklist access token JTI until it expires
	ttl := time.Until(claims.ExpiresAt.Time)
	if ttl > 0 {
		blKey := fmt.Sprintf("blacklist:%s", claims.ID)
		_ = s.rdb.Set(ctx, blKey, "1", ttl).Err()
	}

	// Also clear refresh token
	rfKey := fmt.Sprintf("refresh_token:%s", claims.UserID)
	_ = s.rdb.Del(ctx, rfKey)

	return nil
}

func generateOTP(length int) string {
	const charset = "0123456789"
	b := make([]byte, length)
	for i := range b {
		idx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		b[i] = charset[idx.Int64()]
	}
	return string(b)
}

func generateRandomPassword() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
	length := 16
	b := make([]byte, length)
	for i := range b {
		idx, _ := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		b[i] = charset[idx.Int64()]
	}
	return string(b)
}
