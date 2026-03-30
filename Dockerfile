# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY luxbiss_frontend/package*.json luxbiss_frontend/yarn.lock* ./
RUN yarn install --frozen-lockfile || npm install
COPY luxbiss_frontend .

# Pass build-time variables for Next.js static export
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

RUN yarn build || npm run build

# Stage 2: Build Backend
FROM golang:alpine AS base
RUN apk add --no-cache git ca-certificates curl
WORKDIR /app
COPY luxbiss_server/go.mod luxbiss_server/go.sum ./
RUN go mod download

FROM base AS builder
COPY luxbiss_server .
# Copy built frontend to the expected embed directory
COPY --from=frontend-builder /frontend/out ./cmd/api/web/out
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o /app/server ./cmd/api

# Stage 3: Production Runtime
FROM alpine:3.19 AS prod
RUN apk add --no-cache ca-certificates tzdata curl
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/migrations ./migrations
# Re-create uploads folder for production
RUN mkdir -p public/uploads && chown -R appuser:appgroup public
USER appuser
EXPOSE 8080
ENTRYPOINT ["./server"]
