package email

import (
	"fmt"
	"net/mail"
	"net/smtp"
	"time"
)

type Sender interface {
	SendEmail(to []string, subject string, body string) error
}

type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
	FromName string
}

type SMTPSender struct {
	config *SMTPConfig
}

func NewSMTPSender(cfg *SMTPConfig) *SMTPSender {
	return &SMTPSender{config: cfg}
}

func (s *SMTPSender) SendEmail(to []string, subject string, body string) error {
	auth := smtp.PlainAuth("", s.config.Username, s.config.Password, s.config.Host)
	fromHeader := formatFromHeader(s.config.From, s.config.FromName)

	msg := []byte("To: " + to[0] + "\r\n" +
		"From: " + fromHeader + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"Date: " + time.Now().Format(time.RFC1123Z) + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n" +
		"\r\n" +
		body + "\r\n")

	addr := fmt.Sprintf("%s:%d", s.config.Host, s.config.Port)
	return smtp.SendMail(addr, auth, s.config.From, to, msg)
}

func formatFromHeader(address, name string) string {
	if name == "" {
		return address
	}

	return (&mail.Address{Name: name, Address: address}).String()
}
