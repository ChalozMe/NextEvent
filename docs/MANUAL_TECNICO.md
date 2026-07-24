# Manual Técnico

# NextEvent

## 1. Introducción

Este documento describe la arquitectura, instalación, configuración y funcionamiento técnico del sistema NextEvent.

Está dirigido a desarrolladores y administradores responsables del mantenimiento del proyecto.

---

# 2. Tecnologías Utilizadas

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT
- Maven
- Flyway

## Frontend

- React
- TypeScript
- Vite
- CSS

## Base de Datos

- PostgreSQL

## DevOps

- Docker
- Docker Compose
- Jenkins
- SonarQube

## Documentación

- OpenAPI

---

# 3. Requisitos Previos

Para ejecutar el proyecto se requiere:

- Java JDK 21
- Maven
- Node.js
- npm
- PostgreSQL
- Docker (Opcional)
- Docker Compose (Opcional)
- Git

---

# 4. Instalación

## Clonar el repositorio

```bash
git clone https://github.com/ChalozMe/NextEvent.git

cd NextEvent
```

---

## Backend

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 5. Base de Datos

El proyecto utiliza PostgreSQL.

Las migraciones son ejecutadas automáticamente mediante Flyway.

Migraciones existentes:

- V1 Initial Schema
- V2 Users
- V3 Events
- V4 User Events
- V5 Venues
- V6 Venue Reservations
- V7 Guests
- V8 Expand Events
- V9 Tasks

---

# 6. Arquitectura

La aplicación sigue una arquitectura Cliente – Servidor.

```
Usuario

↓

Frontend (React)

↓

API REST

↓

Spring Boot

↓

PostgreSQL
```

El backend utiliza una arquitectura por capas.

```
Controller

↓

Service

↓

Repository

↓

Entity
```

---

# 7. Organización del Proyecto

```
backend/

config/

controller/

dto/

entity/

repository/

security/

service/

resources/

frontend/

components/

context/

pages/

services/

types/
```

---

# 8. Seguridad

La autenticación se realiza mediante JWT.

Las contraseñas son almacenadas utilizando BCrypt.

Las rutas protegidas requieren autenticación.

---

# 9. API

La aplicación expone una API REST desarrollada con Spring Boot.

Controladores implementados:

- AuthController
- EventController
- HealthController

La documentación de la API se encuentra en:

```
openapi.yaml
```

---

# 10. Docker

El proyecto puede ejecutarse mediante Docker Compose.

```bash
docker compose up --build
```

---

# 11. Integración Continua

El proyecto incorpora:

- GitHub
- Jenkins
- SonarQube
- Docker

Estas herramientas permiten automatizar la compilación y verificar la calidad del código.

---

# 12. Dependencias Principales

## Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- Flyway

## Frontend

- React
- TypeScript
- Vite

---

# 13. Mantenimiento

Para incorporar nuevas funcionalidades se recomienda:

- Crear una nueva rama desde develop.
- Implementar la funcionalidad.
- Realizar pruebas.
- Crear un Pull Request.
- Revisar el código antes de integrar los cambios.

---

# 14. Consideraciones

Actualmente el módulo de cronograma utiliza un servicio simulado.

La arquitectura permite integrar posteriormente un servicio de Inteligencia Artificial sin modificar la estructura principal del sistema.

---

# 15. Conclusiones

La arquitectura implementada permite un desarrollo modular, escalable y mantenible, facilitando futuras mejoras y la incorporación de nuevas funcionalidades.