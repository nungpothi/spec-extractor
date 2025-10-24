#registry.gitlab.com/givemebug/dota2
REGISTRY ?= registry.gitlab.com
REGISTRY_NAMESPACE ?= givemebug/dota2
IMAGE_NAME ?= spec-extractor-app
IMAGE_TAG ?= $(shell date +%m%d%y)
DOCKER_IMAGE ?= $(REGISTRY)/$(REGISTRY_NAMESPACE)/$(IMAGE_NAME):$(IMAGE_TAG)
CONTAINER_NAME ?= spec-extractor-app
COMPOSE_FILE ?= docker-compose.yml
DOCKER_COMPOSE ?= docker compose
LETSENCRYPT_HOST ?= spec-extractor-app.givemebug.online
LETSENCRYPT_EMAIL ?= nungpothi.p@gmail.com

.PHONY: build push run clean

build:
	docker build -t $(DOCKER_IMAGE) .

push:
	docker push $(DOCKER_IMAGE)

run:
	DOCKER_IMAGE=$(DOCKER_IMAGE) $(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down
