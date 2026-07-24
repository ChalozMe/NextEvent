# Implementación del Sistema

# NextEvent

## 1. Metodología de Desarrollo

El desarrollo de NextEvent se realizó utilizando una metodología ágil basada en Scrum, organizando el trabajo en tareas distribuidas entre los integrantes del equipo.

Durante el desarrollo se realizaron reuniones periódicas para revisar avances, asignar responsabilidades y planificar nuevas funcionalidades.

La gestión de actividades se realizó mediante Jira, mientras que el control de versiones fue administrado mediante Git y GitHub.

---

# 2. Organización del Trabajo

El proyecto fue dividido en módulos independientes para permitir el trabajo paralelo entre los integrantes del equipo.

Los principales módulos desarrollados fueron:

- Autenticación
- Gestión de Eventos
- Cronograma
- Gestión de Locales
- RSVP
- Galería
- Calificaciones
- Configuración
- Documentación
- Integración

Cada integrante fue responsable del desarrollo y pruebas de uno o más módulos.

---

# 3. Control de Versiones

Se utilizó Git como sistema de control de versiones.

El repositorio del proyecto fue alojado en GitHub.

Durante el desarrollo se empleó una estrategia basada en ramas para separar nuevas funcionalidades, corrección de errores y documentación antes de integrarlas a la rama principal.

Esta estrategia permitió reducir conflictos y mantener un historial organizado de cambios.

---

# 4. Gestión de Tareas

El seguimiento del proyecto se realizó mediante Jira.

Las tareas fueron registradas y organizadas de acuerdo con los módulos del sistema, permitiendo controlar el avance del proyecto y la asignación de responsabilidades.

Cada tarea incluyó su descripción, responsable y estado de avance.

---

# 5. Desarrollo del Backend

El backend fue desarrollado utilizando Java 21 y Spring Boot.

Su arquitectura se encuentra organizada en capas:

- Controller
- Service
- Repository
- Entity
- DTO
- Security

Esta organización facilita el mantenimiento, la reutilización del código y la separación de responsabilidades.

Las funcionalidades principales implementadas incluyen:

- Autenticación mediante JWT.
- Gestión de eventos.
- Gestión de tareas.
- Gestión de usuarios.
- API REST.
- Acceso a PostgreSQL mediante Spring Data JPA.

---

# 6. Desarrollo del Frontend

El frontend fue desarrollado utilizando React, TypeScript y Vite.

La aplicación se organiza en componentes reutilizables y páginas independientes.

Entre las principales interfaces implementadas se encuentran:

- Inicio de sesión.
- Dashboard.
- Creación de eventos.
- Cronograma.
- Gestión de invitados.
- Catálogo de locales.
- Galería.
- Calificaciones.
- Configuración.

La comunicación con el backend se realiza mediante servicios HTTP que consumen la API REST.

---

# 7. Base de Datos

La persistencia de la información se implementó utilizando PostgreSQL.

El control de versiones del esquema se realizó mediante Flyway, permitiendo mantener un historial de migraciones y facilitar la actualización de la base de datos.

Las entidades principales incluyen:

- Usuarios.
- Eventos.
- Tareas.
- Invitados.
- Locales.
- Reservas.

---

# 8. Seguridad

El sistema implementa autenticación basada en JSON Web Tokens (JWT).

Las contraseñas son almacenadas utilizando algoritmos de encriptación seguros mediante BCrypt.

Las rutas protegidas requieren autenticación para acceder a las funcionalidades administrativas.

---

# 9. API REST

La comunicación entre el frontend y el backend se realiza mediante una API REST.

Los principales controladores implementados son:

- AuthController
- EventController
- HealthController

La documentación de la API se mantiene mediante OpenAPI.

---

# 10. Docker

El proyecto incorpora Docker y Docker Compose para facilitar el despliegue del sistema.

Esto permite ejecutar el entorno completo de desarrollo utilizando contenedores, simplificando la configuración y garantizando consistencia entre distintos entornos.

---

# 11. Integración Continua

Para mejorar la calidad del software se utilizaron herramientas de integración continua.

Las principales herramientas empleadas fueron:

- Jenkins
- SonarQube
- Docker
- GitHub

Estas herramientas permiten automatizar procesos de compilación, análisis de calidad y validación del código.

---

# 12. Buenas Prácticas Aplicadas

Durante el desarrollo se aplicaron diversas buenas prácticas de Ingeniería de Software, entre ellas:

- Arquitectura por capas.
- Separación de responsabilidades.
- Uso de DTO para intercambio de información.
- Control de versiones con Git.
- Desarrollo colaborativo mediante GitHub.
- Gestión de tareas con Jira.
- Migraciones de base de datos con Flyway.
- Documentación de API mediante OpenAPI.
- Uso de Docker para despliegue.
- Integración continua mediante Jenkins.

---

# 13. Estado Actual del Proyecto

Actualmente NextEvent implementa las funcionalidades principales para la gestión de eventos.

El sistema incluye autenticación, administración de eventos, cronograma, gestión de invitados, catálogo de locales, galería, calificaciones y configuración.

La arquitectura se encuentra preparada para integrar un servicio de Inteligencia Artificial destinado a la generación automática de cronogramas, utilizando actualmente un servicio simulado como base para futuras mejoras.

---

# 14. Conclusiones

La implementación de NextEvent permitió aplicar conocimientos relacionados con desarrollo web, arquitectura cliente-servidor, seguridad, persistencia de datos, control de versiones, metodologías ágiles e integración continua.

La organización modular del proyecto facilita el mantenimiento, la escalabilidad y la incorporación de nuevas funcionalidades en versiones futuras.