REGISTRY ?= registry.gitlab.com
REGISTRY_NAMESPACE ?= givemebug/dota2
IMAGE_TAG ?= latest
BACKEND_IMAGE ?= $(REGISTRY)/$(REGISTRY_NAMESPACE)/backend:$(IMAGE_TAG)
FRONTEND_IMAGE ?= $(REGISTRY)/$(REGISTRY_NAMESPACE)/frontend:$(IMAGE_TAG)
COMPOSE_FILE ?= docker-compose-build-and-run.yaml
DOCKER_COMPOSE ?= docker compose

.PHONY: build backend-build frontend-build push backend-push frontend-push run clean

build: backend-build frontend-build

backend-build:
	docker build -t $(BACKEND_IMAGE) ./backend

frontend-build:
	docker build -t $(FRONTEND_IMAGE) ./frontend

push: backend-push frontend-push

backend-push:
	docker push $(BACKEND_IMAGE)

frontend-push:
	docker push $(FRONTEND_IMAGE)

run:
	BACKEND_IMAGE=$(BACKEND_IMAGE) FRONTEND_IMAGE=$(FRONTEND_IMAGE) $(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d --build

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down
