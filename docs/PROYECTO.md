# Propuesta del Proyecto

# NextEvent

## 1. Introducción

NextEvent es una plataforma web desarrollada para facilitar la organización y administración de eventos. El sistema permite a los organizadores gestionar eventos, invitados, cronogramas, locales y diferentes recursos desde una única aplicación, ofreciendo una experiencia intuitiva tanto para los organizadores como para los participantes.

El proyecto fue desarrollado como parte del curso **Ingeniería de Software III** de la Escuela Profesional de Ciencia de la Computación de la Universidad Nacional de San Agustín de Arequipa, aplicando metodologías ágiles, buenas prácticas de desarrollo, control de versiones y herramientas modernas de ingeniería de software.

---

# 2. Problema

La organización de eventos suele involucrar múltiples actividades como la planificación del cronograma, la administración de invitados, la reserva de locales y el seguimiento de tareas. Cuando estas actividades se realizan utilizando herramientas independientes o procesos manuales, aumenta la probabilidad de errores, retrasos y dificultades de coordinación entre los responsables del evento.

Ante esta problemática surge la necesidad de una plataforma que centralice la gestión de todas estas actividades en un único sistema.

---

# 3. Objetivo General

Desarrollar una plataforma web para la gestión integral de eventos que permita administrar organizadores, invitados, cronogramas, locales y recursos asociados mediante una arquitectura moderna y escalable.

---

# 4. Objetivos Específicos

- Implementar un sistema de autenticación seguro mediante JWT.
- Permitir la creación, edición y administración de eventos.
- Gestionar invitados mediante confirmación RSVP.
- Administrar locales disponibles para eventos.
- Gestionar galerías multimedia asociadas a cada evento.
- Permitir la calificación de eventos por parte de los usuarios.
- Implementar una arquitectura preparada para integrar servicios de Inteligencia Artificial para la generación de cronogramas.
- Aplicar buenas prácticas de Ingeniería de Software durante todo el desarrollo.

---

# 5. Alcance

El sistema permite administrar las principales actividades relacionadas con la organización de eventos.

Incluye:

- Gestión de usuarios.
- Gestión de eventos.
- Gestión de invitados.
- Confirmaciones RSVP.
- Catálogo de locales.
- Cronograma de actividades.
- Galería multimedia.
- Calificaciones.
- Configuración del sistema.

No se incluye en esta versión la integración con una API de Inteligencia Artificial; la arquitectura queda preparada para futuras versiones.

---

# 6. Justificación

La gestión eficiente de eventos requiere coordinar múltiples procesos que normalmente se realizan utilizando diferentes herramientas. NextEvent busca centralizar dichas actividades en una única plataforma, mejorando la organización, reduciendo errores y facilitando el seguimiento de cada evento.

Desde el punto de vista académico, el proyecto permite aplicar conocimientos relacionados con Ingeniería de Software, arquitectura cliente-servidor, desarrollo web, bases de datos, seguridad, integración continua y metodologías ágiles.

---

# 7. Roles del Equipo

El proyecto fue desarrollado por un equipo conformado por siete integrantes.

Las responsabilidades fueron distribuidas entre el desarrollo del backend, frontend, base de datos, documentación, pruebas e integración de los diferentes módulos del sistema.

---

# 8. Metodología de Desarrollo

Para el desarrollo del proyecto se empleó una metodología ágil basada en Scrum.

Durante el desarrollo se utilizaron iteraciones cortas para implementar nuevas funcionalidades, realizar revisiones del avance y distribuir el trabajo entre los integrantes del equipo.

El control del progreso se realizó mediante Jira y el control de versiones mediante GitHub.

---

# 9. Tecnologías Utilizadas

## Backend

- Java 21
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA
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

# 10. Resultados Esperados

Con la implementación de NextEvent se espera proporcionar una plataforma centralizada para la administración de eventos que facilite la organización de actividades, optimice la gestión de invitados y permita una mejor planificación de los recursos involucrados en cada evento.