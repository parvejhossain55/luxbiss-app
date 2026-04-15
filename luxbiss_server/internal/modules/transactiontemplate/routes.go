package transactiontemplate

import (
	"github.com/gin-gonic/gin"
	"github.com/parvej/luxbiss_server/internal/middleware"
	"github.com/parvej/luxbiss_server/pkg/jwt"
	"github.com/redis/go-redis/v9"
)

func RegisterRoutes(
	router *gin.RouterGroup,
	handler *Handler,
	jwtManager *jwt.Manager,
	rdb *redis.Client,
) {
	templates := router.Group("/transaction-templates")
	templates.Use(middleware.Auth(jwtManager, rdb), middleware.RequireRole("admin"))
	{
		templates.POST("", handler.Create)
		templates.GET("", handler.List)
		templates.PUT("/:id", handler.Update)
		templates.DELETE("/:id", handler.Delete)
	}
}
