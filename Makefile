MAVEN_IMAGE := maven:3.9-eclipse-temurin-21
NODE_IMAGE  := node:20
M2_CACHE    := maven-repo-cache

.PHONY: help build test lint up down logs ps clean frontend-test frontend-build

help:
	@echo "Comandos disponibles (no requieren Java/Maven/Node instalados localmente):"
	@echo "  make build           Compila el backend (mvn package)"
	@echo "  make test            Corre mvn verify (build + tests + jacoco)"
	@echo "  make lint            Corre Checkstyle + SpotBugs"
	@echo "  make up              Levanta backend + postgres (docker compose)"
	@echo "  make down            Baja los contenedores"
	@echo "  make logs            Sigue los logs del backend"
	@echo "  make clean           Baja contenedores, borra volúmenes y target/"
	@echo "  make frontend-test   Corre type-check + lint + test del frontend"
	@echo "  make frontend-build  Compila el frontend"

build:
	docker run --rm \
		-v $(CURDIR)/backend:/build \
		-v $(M2_CACHE):/root/.m2 \
		-w /build \
		$(MAVEN_IMAGE) mvn -B package -DskipTests

test:
	docker run --rm \
		-v $(CURDIR)/backend:/build \
		-v $(M2_CACHE):/root/.m2 \
		-w /build \
		$(MAVEN_IMAGE) mvn -B verify

lint:
	docker run --rm \
		-v $(CURDIR)/backend:/build \
		-v $(M2_CACHE):/root/.m2 \
		-w /build \
		$(MAVEN_IMAGE) sh -c "mvn -B checkstyle:check && mvn -B compile spotbugs:check"

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f backend

clean:
	docker compose down -v
	rm -rf backend/target

frontend-test:
	docker run --rm -v $(CURDIR)/frontend:/app -w /app $(NODE_IMAGE) \
		sh -c "npm ci && npm run type-check && npm run lint && npm test"

frontend-build:
	docker run --rm -v $(CURDIR)/frontend:/app -w /app $(NODE_IMAGE) \
		sh -c "npm ci && npm run build"
