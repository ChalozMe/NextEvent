# Suite de Casos de Prueba Funcionales — NextEvent

Este documento contiene la especificación detallada de los Casos de Prueba (TC) para validar la funcionalidad del sistema **NextEvent** en los módulos de Autenticación y Gestión de Eventos.

---

## 🔐 Módulo: Autenticación (Auth)

### TC-AUTH-01: Registro exitoso de organizador (API & UI)
* **Objetivo:** Verificar que un nuevo usuario puede registrarse con éxito ingresando datos válidos.
* **Precondiciones:** El correo electrónico ingresado no debe estar registrado previamente en la base de datos.
* **Pasos de Ejecución:**
  1. Enviar una petición `POST` a `/api/auth/register` (o llenar el formulario de registro en la interfaz de React en `/register`).
  2. Enviar el siguiente payload de datos:
     ```json
     {
       "name": "Tester QA",
       "email": "smoke-test@nexevent.com",
       "password": "Password123"
     }
     ```
  3. Comprobar la respuesta del servidor y la persistencia del registro en la tabla `users` de PostgreSQL.
* **Resultado Esperado:**
  * HTTP Status: `200 OK`.
  * Body: `"User registered"`.
  * La contraseña en la base de datos debe guardarse encriptada en el campo `password_hash` (formato BCrypt).
* **Evidencia Requerida:** Captura de pantalla de Postman mostrando Status `200 OK` y el texto de respuesta.

---

### TC-AUTH-02: Registro fallido por correo duplicado (API)
* **Objetivo:** Validar que el sistema impide el registro de dos usuarios con el mismo correo electrónico.
* **Precondiciones:** El usuario `smoke-test@nexevent.com` ya debe existir en la base de datos.
* **Pasos de Ejecución:**
  1. Enviar la misma petición `POST` a `/api/auth/register` utilizando el correo duplicado.
  2. Verificar la respuesta del servidor.
* **Resultado Esperado:**
  * HTTP Status: `500 Internal Server Error` (o `409 Conflict` si se maneja a nivel de base de datos/controlador).
  * La base de datos no debe duplicar la fila (restricción UNIQUE en la columna `email`).
* **Evidencia Requerida:** Captura de pantalla de Postman con el código de error y el mensaje de constraint de base de datos o stacktrace en consola.

---

### TC-AUTH-03: Registro fallido por campos vacíos o nulos (API)
* **Objetivo:** Verificar que no se permite registrar usuarios si faltan campos obligatorios.
* **Precondiciones:** Ninguna.
* **Pasos de Ejecución:**
  1. Enviar una petición `POST` a `/api/auth/register` con el siguiente body (sin contraseña):
     ```json
     {
       "name": "Tester QA",
       "email": "invalid-email@nexevent.com"
     }
     ```
* **Resultado Esperado:**
  * HTTP Status: `400 Bad Request` o `500 Internal Server Error` (por validación nula de Hibernate en JPA).
* **Evidencia Requerida:** Captura del código de estado en Postman.

---

### TC-AUTH-04: Login exitoso del organizador (API & UI)
* **Objetivo:** Validar que un organizador con credenciales correctas puede iniciar sesión y obtener un token JWT.
* **Precondiciones:** El usuario `smoke-test@nexevent.com` con clave `Password123` debe estar registrado en el sistema.
* **Pasos de Ejecución:**
  1. Enviar petición `POST` a `/api/auth/login` (o usar la pantalla de login `/login` del frontend).
  2. Enviar el JSON:
     ```json
     {
       "email": "smoke-test@nexevent.com",
       "password": "Password123"
     }
     ```
* **Resultado Esperado:**
  * HTTP Status: `200 OK`.
  * Body: Objeto JSON conteniendo el JWT token (`"token": "eyJhb..."`), `"username": "Tester QA"`, `"fullName": "Tester QA"` y `"role": "ADMIN"`.
  * El token debe guardarse en el `localStorage` en el navegador.
* **Evidencia Requerida:** Captura de la respuesta estructurada del JSON en Postman.

---

### TC-AUTH-05: Login fallido por contraseña incorrecta (API)
* **Objetivo:** Comprobar que se deniega el acceso si la contraseña ingresada es incorrecta.
* **Precondiciones:** El usuario `smoke-test@nexevent.com` debe existir.
* **Pasos de Ejecución:**
  1. Enviar petición `POST` a `/api/auth/login` con:
     ```json
     {
       "email": "smoke-test@nexevent.com",
       "password": "wrongPassword"
     }
     ```
* **Resultado Esperado:**
  * HTTP Status: `401 Unauthorized` (debido al bloqueo de la redirección `/error` en el backend) o `500` con el mensaje de credenciales inválidas.
* **Evidencia Requerida:** Captura de la respuesta HTTP y código.

---

## 📅 Módulo: Gestión de Eventos (Events)

### TC-EVENT-01: Creación exitosa de evento (API & UI)
* **Objetivo:** Validar que un organizador autenticado puede registrar un evento y gatillar la generación de tareas.
* **Precondiciones:** Disponer de un token JWT válido y guardado en `{{JWT_TOKEN}}`.
* **Pasos de Ejecución:**
  1. Enviar una petición `POST` a `/api/events` con el header `Authorization: Bearer {{JWT_TOKEN}}`.
  2. Enviar el siguiente payload de datos:
     ```json
     {
       "name": "Boda de Oro de Prueba",
       "type": "Boda",
       "eventDate": "2027-12-15T18:00:00",
       "capacity": 150,
       "location": "Jardín Los Sauces",
       "description": "Evento de pruebas de QA funcionales",
       "budget": 25000.00,
       "status": "Planificado"
     }
     ```
* **Resultado Esperado:**
  * HTTP Status: `200 OK`.
  * Body: `"Event created"` (Texto plano).
  * En la base de datos se debe crear el registro en la tabla `events`, crear la relación de dueño en `user_events` con rol `OWNER`, y generar las tareas por plantilla en la tabla `tasks`.
* **Evidencia Requerida:** Captura del Status Code 200 de la petición en Postman.

---

### TC-EVENT-02: Creación fallida por fecha en el pasado (RN04)
* **Objetivo:** Verificar que el sistema rechaza eventos con fechas que ya transcurrieron según la regla **RN04**.
* **Precondiciones:** Disponer de un token JWT válido.
* **Pasos de Ejecución:**
  1. Enviar petición `POST` a `/api/events` con el header de autorización.
  2. Enviar el JSON con fecha pasada:
     ```json
     {
       "name": "Evento Viejo",
       "type": "Boda",
       "eventDate": "2020-01-01T12:00:00",
       "capacity": 100,
       "budget": 5000.00
     }
     ```
* **Resultado Esperado:**
  * HTTP Status: `400 Bad Request` o mensaje de error de validación de negocio.
* **Evidencia Requerida:** Captura del código de estado HTTP en Postman.

---

### TC-EVENT-03: Creación fallida por tipo de evento inválido (RN09)
* **Objetivo:** Verificar que solo se aceptan los tipos de eventos permitidos (Boda, Quinceañero, Empresarial) según la regla **RN09**.
* **Precondiciones:** Token JWT válido.
* **Pasos de Ejecución:**
  1. Enviar petición `POST` a `/api/events` enviando el tipo `"Graduación"`.
* **Resultado Esperado:**
  * HTTP Status: `400 Bad Request`.
* **Evidencia Requerida:** Captura del mensaje de error del backend en Postman.

---

### TC-EVENT-04: Creación fallida por aforo o presupuesto negativo
* **Objetivo:** Validar que los campos numéricos de capacidad y presupuesto no admitan valores negativos.
* **Precondiciones:** Token JWT válido.
* **Pasos de Ejecución:**
  1. Enviar petición `POST` a `/api/events` con `capacity: -50` o `budget: -1000.00`.
* **Resultado Esperado:**
  * HTTP Status: `400 Bad Request`.
* **Evidencia Requerida:** Captura de pantalla de la validación del backend.

---

## 🚫 Pruebas Teóricas / Brechas de Backend (Módulos Incompletos)

### TC-EVENT-06: Intento de edición de evento (API)
* **Objetivo:** Modificar los datos de un evento existente (US-12).
* **Precondiciones:** El evento debe existir.
* **Pasos de Ejecución:** Enviar petición `PUT` a `/api/events/{id}` con el payload de actualización.
* **Resultado Esperado (Según OpenAPI):** HTTP `200 OK` con el JSON del evento actualizado.
* **Resultado Observado Real:** HTTP `404 Not Found` o `405 Method Not Allowed` (El endpoint no existe en el controlador).
* **Estado:** **BLOQUEADO** (Registrado como brecha de desarrollo).

---

### TC-EVENT-07: Intento de eliminación de evento (API)
* **Objetivo:** Eliminar un evento y todas sus cascadas asociadas (US-13).
* **Precondiciones:** El evento debe existir.
* **Pasos de Ejecución:** Enviar petición `DELETE` a `/api/events/{id}`.
* **Resultado Esperado (Según OpenAPI):** HTTP `204 No Content`.
* **Resultado Observado Real:** HTTP `404 Not Found` (El endpoint no existe en el controlador).
* **Estado:** **BLOQUEADO** (Registrado como brecha de desarrollo).
