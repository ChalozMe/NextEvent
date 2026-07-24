# Plan de Pruebas (Test Plan) — NextEvent

## 1. Introducción
El presente **Plan de Pruebas** establece la estrategia y el alcance de las actividades de Aseguramiento de Calidad (QA) para la plataforma **NextEvent** (sistema inteligente de gestión de eventos). El plan está estructurado bajo las directrices del estándar **IEEE 829** adaptado a un entorno ágil (Scrum/Jira), definiendo cómo validar las historias de usuario terminadas frente a la realidad de la base del código.

---

## 2. Objetivos de QA
* **Validación de Funcionalidad:** Garantizar que los flujos críticos de negocio descritos en el contrato `openapi.yaml` funcionen según lo esperado.
* **Consistencia de Integración:** Verificar la correcta comunicación entre el frontend (React/TS) y el backend (Spring Boot/Java), incluyendo la capa de persistencia (PostgreSQL/Flyway).
* **Control de Calidad de Infraestructura:** Validar que los contenedores de Docker y los pipelines de GitHub Actions operen correctamente en el entorno local y de integración continua.
* **Documentación y Evidencia:** Generar un histórico ordenado de pruebas, errores (bugs) y coberturas que sirvan de evidencia de QA para el proyecto.

---

## 3. Alcance de las Pruebas

### 🟢 Dentro de Alcance Técnico (Ejecutables en API Real)
Estas funcionalidades disponen de endpoints implementados en el Backend y pueden ser probadas tanto a nivel de API (Postman) como en la UI integrada:
* **US-01 / SCRUM-362 (Inicio de sesión):** Autenticación de usuarios mediante correo y contraseña, y retorno exitoso del token JWT.
* **US-08 / SCRUM-367 (Registro de nueva cuenta):** Registro de nuevos organizadores en el sistema, persistiendo sus credenciales encriptadas con BCrypt en la base de datos PostgreSQL.
* **US-02 / SCRUM-373 (Creación de evento):** Registro de eventos en la base de datos asociados al usuario autenticado (se valida fecha futura, aforo y presupuesto).
* **Gestión de Infraestructura (US-17, US-18, US-19, US-20):** Despliegue de servicios a través de Docker Compose, uso de variables de entorno (`.env`) y pipeline CI/CD en GitHub.

### 🔴 Fuera de Alcance Técnico Directo (Pruebas Teóricas e Interfaz)
Debido a la ausencia de controladores, servicios y entidades en el backend, no es posible ejecutar pruebas dinámicas de integración en estos módulos. Su validación se limitará a:
1. Pruebas de usabilidad en el Frontend (validación visual de pantallas hardcoded).
2. Diseño teórico de casos de prueba de API y UI basados en el contrato OpenAPI.
3. Registro de "Bugs de Bloqueo" por falta de integración en el backend.

Módulos afectados:
* **US-03 / SCRUM-378 (Generación IA de cronograma):** No existe el motor de IA en el backend ni persistencia de tareas.
* **US-12 / SCRUM-400 (Editar evento):** Sin endpoint PUT `/events/{id}` en el backend.
* **US-13 / SCRUM-405 (Eliminar evento):** Sin endpoint DELETE `/events/{id}` en el backend.
* **US-04 / SCRUM-411 (Disponibilidad de locales):** Sin entidades ni controladores de Locales (`Venues`).
* **US-14 / SCRUM-416 (Galería de locales):** Sin galería de fotos asociadas a locales.
* **US-06 / SCRUM-450 (Confirmación de asistencia RSVP):** Sin endpoints ni tokens UUID para invitados.
* **US-15 / SCRUM-460 (Subida de fotos):** Sin soporte multipart para archivos JPG/PNG de eventos.

---

## 4. Estrategia de Pruebas

### 🔍 4.1 Pruebas de Humo (Smoke Testing)
* **Objetivo:** Verificar la estabilidad básica de la aplicación tras cada compilación o reinicio de contenedores.
* **Casos Críticos:**
  * Endpoint `/api/health` retorna HTTP 200 (Backend arriba).
  * Conexión exitosa a PostgreSQL (las migraciones de Flyway deben estar aplicadas).
  * Carga inicial de la pantalla de login en Frontend (Vite).
* **Herramientas:** Postman, Newman.

### ⚙️ 4.2 Pruebas Funcionales y de API (Functional & API Testing)
* **Objetivo:** Probar el comportamiento de los endpoints implementados frente a datos de entrada correctos, inválidos y límites (Boundary values).
* **Estrategia:**
  * **Casos Positivos:** Datos válidos para Registro (`/api/auth/register`), Login (`/api/auth/login`) y Crear Evento (`/api/events`).
  * **Casos Negativos:** Correos duplicados, contraseñas cortas, fechas pasadas para eventos (Violación de la Regla de Negocio **RN04**), aforo o presupuestos negativos.
* **Validación en Postman:** Uso de `pm.response.to.have.status(...)` y scripts para verificar que los mensajes de error coincidan con el contrato OpenAPI.

### 🔗 4.3 Pruebas de Integración (Integration Testing)
* **Objetivo:** Evaluar el flujo de datos completo a través de los diferentes componentes del sistema.
* **Escenario de Integración Base:**
  1. Registro de un nuevo organizador (POST `/api/auth/register`).
  2. Inicio de sesión del organizador (POST `/api/auth/login`) para obtener el JWT.
  3. Creación de un evento (POST `/api/events`) enviando el header `Authorization: Bearer <JWT>`.
  4. Consulta de la lista de eventos (GET `/api/events`) verificando que el evento creado persista y se asocie correctamente al organizador en PostgreSQL.
* **Persistencia de Base de Datos:** Verificación de las tablas a través de clientes de PostgreSQL (como pgAdmin, DBeaver o CLI de Docker) para comprobar que los datos no se queden en memoria.

### 🔄 4.4 Pruebas de Regresión (Regression Testing)
* **Objetivo:** Asegurar que las correcciones de bugs de desarrollo o la integración de nuevos endpoints no afecten los flujos funcionales ya existentes (Auth y Events).
* **Estrategia:** Re-ejecutar de forma automatizada las colecciones de humo e integración cada vez que se actualice la rama `main` o se despliegue una nueva versión de Docker.

---

## 5. Entorno de Pruebas (Test Environment)

| Componente | Tecnología | Dirección de Red / URL | Configuración / Puerto |
| :--- | :--- | :--- | :--- |
| **Frontend** | React / TypeScript | `http://localhost:5173` | Puerto por defecto de Vite |
| **Backend** | Spring Boot / Java 21 | `http://localhost:8080` | Tomcat Embebido (`/api`) |
| **Base de Datos**| PostgreSQL | `jdbc:postgresql://localhost:5432/nexevent` | Ejecutado en Docker |
| **Migraciones** | Flyway | Integrado en el Backend | Valida el esquema al arrancar |

---

## 6. Criterios de Aceptación y Rechazo

### Criterios de Suspensión (Bloqueos)
Las pruebas del sistema se suspenderán si ocurre alguno de los siguientes eventos:
* El contenedor de la base de datos o el backend no compilan o fallan al iniciar.
* Las migraciones de Flyway fallan y bloquean el esquema de la BD.
* Los endpoints críticos de autenticación (`/login` o `/register`) retornan errores 500 consistentes.

### Criterios de Reanudación
Las pruebas se reanudarán una vez que:
* Desarrollo aplique un fix a la rama de integración.
* Se despliegue con éxito una versión estable en Docker Local.

### Criterios de Aceptación de Entrega (Definición de Done para QA)
* El 100% de las pruebas de humo estén en estado **Pass**.
* El 90% de los casos de prueba funcionales e integración para los módulos existentes se ejecuten exitosamente.
* No existan Bugs críticos o bloqueantes abiertos sobre las funcionalidades en producción.

---

## 7. Matriz de Riesgos y Mitigación

| Riesgo Detectado | Impacto | Probabilidad | Estrategia de Mitigación (QA) |
| :--- | :--- | :--- | :--- |
| **Ausencia de endpoints backend para el 70% de las US** | Alto | Alta (Confirmada) | Reportar la brecha a desarrollo. Diseñar y documentar la suite de pruebas teóricas basadas en el contrato OpenAPI para estar listos cuando se entregue el código. |
| **Inconsistencia en DTO de Registro** | Medio | Alta (Confirmada) | El endpoint `/register` del backend devuelve texto plano en lugar del objeto estructurado. Mitigación: Documentar la discrepancia y ajustar el Postman temporalmente para validar texto plano. |
| **Falta de cobertura de pruebas unitarias en Backend** | Medio | Alta | Crear un esqueleto inicial de pruebas unitarias con JUnit en `src/test/java` que sirva como plantilla para los desarrolladores. |
| **Base de datos inconsistente localmente** | Medio | Media | Asegurar que el script de Docker Compose levante PostgreSQL con volumen persistente y Flyway habilitado para validar el esquema. |
