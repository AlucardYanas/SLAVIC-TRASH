.DEFAULT_GOAL := help

#env := .env

ACCENT := $(shell tput setaf 3)
RESET := $(shell tput sgr0)

CLIENT_SERVICE := client
SERVER_SERVICE := server


.PHONY: build
build: ##  Build without cache
	@docker-compose down --remove-orphans
	@docker-compose build --no-cache

.PHONY: start
start: stop ##  Full start
	@docker-compose up --force-recreate --remove-orphans -d
	@docker-compose ps

.PHONY: bash
bash.%: ##  Open shell in service [sh.[service]]
	docker-compose run --rm $* bash

.PHONY: stop
stop:  ##  Full stop
	@docker-compose down --remove-orphans

.PHONY: init-db
init-db:  ##  Run init db
	@docker-compose run --rm ${SERVER_SERVICE} sh -c /opt/app/init-db.sh

.PHONY: ls
ls:  ##  List services
	@docker-compose ps -a

.PHONY: help
help:  ##  Show this message
	@echo ""
	@grep -E '^[a-zA-Z.%_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | awk 'BEGIN {FS = ":.*?## "}; {printf " $(ACCENT)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""