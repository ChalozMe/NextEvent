# Arquitectura del Sistema

# NextEvent

## 1. Arquitectura General

NextEvent es una aplicación web desarrollada bajo una arquitectura **Cliente – Servidor**, donde el frontend consume los servicios REST expuestos por el backend. Esta arquitectura permite separar las responsabilidades entre la interfaz de usuario, la lógica de negocio y la persistencia de datos, facilitando el mantenimiento y la escalabilidad del sistema.

La comunicación entre el cliente y el servidor se realiza mediante peticiones HTTP utilizando una API REST.

```
                    Usuario
                       │
                       ▼
      Frontend (React + TypeScript)
                       │
                  HTTP / REST
                       │
                       ▼
      Backend (Spring Boot - Java)
                       │
               Spring Data JPA
                       │
                       ▼
                 PostgreSQL
```

---

# 2. Arquitectura del Backend

El backend fue desarrollado utilizando **Java 21** y **Spring Boot 3**, siguiendo una arquitectura por capas.

```
controller
      │
      ▼
service
      │
      ▼
repository
      │
      ▼
entity
      │
      ▼
PostgreSQL
```

Cada capa tiene una responsabilidad específica.

## Controller

Expone los endpoints REST que permiten la comunicación con el frontend.

Controladores implementados:

- AuthController
- EventController
- HealthController

---

## Service

Implementa la lógica de negocio del sistema.

Servicios principales:

- AuthService
- EventService
- TaskService
- TaskTemplateService

---

## Repository

Gestiona el acceso a la base de datos mediante Spring Data JPA.

Repositorios:

- UserRepository
- EventRepository
- TaskRepository
- UserEventRepository

---

## Entity

Representa las entidades persistentes almacenadas en PostgreSQL.

Entidades:

- User
- Event
- Task
- UserEvent

---

## DTO

Los Data Transfer Objects permiten intercambiar información entre el cliente y el servidor sin exponer directamente las entidades de la base de datos.

DTO implementados:

- LoginRequest
- LoginResponse
- RegisterRequest
- EventRequest
- JoinEventRequest

---

## Seguridad

La autenticación utiliza JSON Web Tokens (JWT).

Componentes:

- SecurityConfig
- JwtAuthenticationFilter
- JwtService

Las contraseñas se almacenan utilizando BCrypt.

---

# 3. Arquitectura del Frontend

El frontend fue desarrollado utilizando React, TypeScript y Vite.

Su estructura modular facilita el mantenimiento y la reutilización de componentes.

```
components/
context/
pages/
services/
types/
assets/
```

## Components

Contiene componentes reutilizables de la interfaz.

Ejemplos:

- Layout
- Sidebar
- ProtectedRoute

---

## Pages

Contiene las principales vistas del sistema.

- Login
- Dashboard
- Crear Evento
- Cronograma
- Gestión RSVP
- Catálogo de Locales
- Detalle de Local
- Galería
- Calificaciones
- Configuración

---

## Services

Gestiona la comunicación con la API REST.

Servicios implementados:

- authService
- eventService

---

## Context

Implementa el manejo global del estado de autenticación mediante React Context.

---

# 4. Base de Datos

El sistema utiliza PostgreSQL como gestor de base de datos.

Las migraciones son administradas mediante Flyway.

Migraciones implementadas:

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

# 5. Comunicación del Sistema

El flujo de comunicación sigue el siguiente proceso:

1. El usuario interactúa con la interfaz web.
2. React envía solicitudes HTTP al backend.
3. Spring Boot procesa la solicitud.
4. La lógica de negocio es ejecutada por la capa Service.
5. Los Repository acceden a PostgreSQL.
6. El resultado es devuelto al frontend en formato JSON.

---

# 6. Tecnologías Utilizadas

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Maven
- JWT

## Frontend

- React
- TypeScript
- Vite
- CSS

## Base de Datos

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

# 7. Integración Continua

El proyecto incorpora herramientas para automatizar el desarrollo y mejorar la calidad del software.

- Git
- GitHub
- Jenkins
- SonarQube
- Docker

Estas herramientas permiten automatizar la compilación, análisis de calidad y despliegue del sistema.

---

# 8. Escalabilidad

La arquitectura implementada facilita la incorporación de nuevos módulos sin afectar los existentes.

El sistema se encuentra preparado para futuras mejoras, entre ellas:

- Integración con un servicio de Inteligencia Artificial para generación de cronogramas.
- Notificaciones automáticas.
- Integración con servicios externos.
- Despliegue en la nube.
- Aplicación móvil.

---

# 9. Conclusiones

La arquitectura de NextEvent sigue un diseño por capas que separa claramente la presentación, la lógica de negocio y la persistencia de datos. Esta organización mejora la mantenibilidad, reutilización y escalabilidad del sistema, además de facilitar futuras integraciones con nuevos servicios y funcionalidades.