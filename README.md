# 🎉 NextEvent

> Plataforma web para la gestión y organización de eventos, diseñada para facilitar la planificación, administración y seguimiento de actividades mediante una interfaz moderna y una arquitectura cliente-servidor.

---

## 📖 Descripción

NextEvent es una aplicación web desarrollada como proyecto del curso **Ingeniería de Software III** de la Escuela Profesional de Ciencia de la Computación de la Universidad Nacional de San Agustín de Arequipa.

La plataforma permite a organizadores administrar eventos desde una única aplicación, gestionando usuarios, eventos, invitados, cronogramas, locales y diferentes funcionalidades relacionadas con la organización de actividades.

El proyecto fue desarrollado siguiendo buenas prácticas de Ingeniería de Software, utilizando control de versiones con Git, metodología ágil, integración continua y una arquitectura por capas.

---

# ✨ Funcionalidades

Actualmente el sistema incluye los siguientes módulos:

- 🔐 Inicio de sesión de usuarios
- 📊 Dashboard principal
- 📅 Creación y administración de eventos
- 🤖 Cronograma de actividades (servicio preparado para integración con IA)
- 🏢 Catálogo de locales
- 👥 Gestión de invitados (RSVP)
- 🖼️ Galería del evento
- ⭐ Calificaciones y reseñas
- ⚙️ Configuración del sistema

---

# 🏗 Arquitectura

El sistema sigue una arquitectura Cliente – Servidor.

```
                 Usuario
                    │
                    ▼
      Frontend (React + TypeScript)
                    │
             REST API (HTTP)
                    │
                    ▼
      Backend (Spring Boot Java)
                    │
      Spring Data JPA + Flyway
                    │
                    ▼
             PostgreSQL
```

La aplicación se encuentra dividida en dos componentes principales:

## Frontend

- React
- TypeScript
- Vite
- CSS

Responsable de la interfaz de usuario y comunicación con la API REST.

## Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Maven

Responsable de la lógica del negocio, autenticación, persistencia de datos y servicios REST.

---

# 🗂 Estructura del proyecto

```
NextEvent
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile.dev
│
├── docker-compose.yml
├── Jenkinsfile
├── Makefile
├── openapi.yaml
└── README.md
```

## Backend

La aplicación backend sigue una arquitectura por capas.

```
controller/
dto/
entity/
repository/
service/
config/
security/
```

### Controller

Expone los endpoints REST de la aplicación.

### Service

Implementa la lógica del negocio.

### Repository

Gestiona el acceso a la base de datos mediante Spring Data JPA.

### Entity

Representa las entidades persistentes de PostgreSQL.

### DTO

Objetos de transferencia utilizados entre cliente y servidor.

### Security

Implementación de autenticación basada en JWT.

---

## Frontend

El frontend se organiza en módulos independientes.

```
components/
context/
pages/
services/
types/
assets/
```

Las vistas implementadas incluyen:

- Login
- Dashboard
- Crear Evento
- Cronograma
- Gestión RSVP
- Catálogo de Locales
- Galería
- Calificaciones
- Configuración

---

# 🛠 Tecnologías utilizadas

## Frontend

- React
- TypeScript
- Vite
- CSS

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT
- Maven

## Base de datos

- PostgreSQL
- Flyway

## DevOps

- Docker
- Docker Compose
- Jenkins
- SonarQube

## Documentación

- OpenAPI

---

# 🔒 Seguridad

La autenticación del sistema utiliza JSON Web Tokens (JWT).

Las contraseñas son almacenadas mediante hash utilizando Spring Security.

---

# 🗄 Base de datos

El proyecto utiliza PostgreSQL como sistema gestor de base de datos.

La creación y actualización del esquema se realiza mediante Flyway utilizando migraciones versionadas.

Ejemplo:

```
V1__initial_schema.sql
V2__create_users.sql
V3__create_events.sql
...
V9__create_tasks.sql
```

---

# 🚀 Instalación

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

# 🐳 Docker

También es posible ejecutar el proyecto utilizando Docker Compose.

```bash
docker compose up --build
```

---

# 📄 API

La especificación OpenAPI del proyecto se encuentra disponible en:

```
openapi.yaml
```

---

# 🔄 Integración Continua

El proyecto incorpora herramientas para automatizar el desarrollo:

- Jenkins
- Docker
- SonarQube

Estas herramientas permiten automatizar procesos de integración, análisis de calidad y despliegue.

---

# 📋 Gestión del proyecto

El desarrollo del proyecto fue organizado utilizando una metodología ágil y herramientas de gestión colaborativa.

- Git
- GitHub
- Jira

---

# 👥 Equipo

Proyecto desarrollado por estudiantes de la Escuela Profesional de Ciencia de la Computación de la Universidad Nacional de San Agustín de Arequipa.

- Claudia Victoria Agostinelli Córdova
- Edilson Bonet Mamani Yucra
- César Gonzalo Carpio Paiva
- Lenin Michael Huayhua Carlos
- Johan Fabricio Lizarve Mamani
- Wilson Ramos Pacco
- Ángela Shirleth Soto Huerta

Curso:

**Ingeniería de Software III**

Docente:

**Mg. Rolando Jesús Cárdenas Talavera**

---

# 📌 Estado del proyecto

El sistema implementa las principales funcionalidades de gestión de eventos.

El módulo de cronograma fue diseñado para permitir su integración con un servicio de Inteligencia Artificial. En la versión actual, dicha funcionalidad utiliza un servicio simulado, dejando preparada la arquitectura para una futura integración con un proveedor de IA.

---

# 📜 Licencia

Proyecto desarrollado con fines académicos para el curso Ingeniería de Software III.

Universidad Nacional de San Agustín de Arequipa.