#!/usr/bin/env bash

docker build -t guardian-notification-service:latest -f ./notification-service/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-logger-service:latest -f ./logger-service/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-worker-service:latest -f ./worker-service/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-auth-service:latest -f ./auth-service/Dockerfile.demo --platform linux/amd64,linux/arm64 .
docker build -t guardian-api-gateway:latest -f ./api-gateway/Dockerfile.demo --platform linux/amd64,linux/arm64 .
docker build -t guardian-policy-service:latest -f ./policy-service/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-mrv-sender:latest -f ./mrv-sender/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-guardian-service:latest -f ./guardian-service/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-web-proxy:latest -f ./web-proxy/Dockerfile.demo --platform linux/amd64,linux/arm64 .
docker build -t guardian-application-events:latest -f ./application-events/Dockerfile --platform linux/amd64,linux/arm64 .
docker build -t guardian-topic-viewer:latest -f ./topic-viewer/Dockerfile --platform linux/amd64,linux/arm64 .
