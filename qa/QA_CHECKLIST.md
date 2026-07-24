# Checklist de Calidad (QA Checklist) — NextEvent

Este checklist sirve como guía técnica obligatoria para que el QA Tester valide cada entrega de software y despliegue local de **NextEvent**. Cada verificación debe marcarse antes de dar por aprobada una historia de usuario o versión de la plataforma.

---

## 🛠️ 1. Infraestructura y Configuración de Entorno

- [ ] **Docker Compose:** El archivo `docker-compose.yml` inicia correctamente todos los contenedores (`backend`, `frontend`, `db`).
- [ ] **Base de Datos:** El contenedor de PostgreSQL (`db`) levanta sin errores de puertos y es accesible externamente.
- [ ] **Variables de Entorno:** El archivo `.env` local contiene todas las variables requeridas por el backend (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, etc.) y el frontend (`VITE_API_URL`).
- [ ] **Compilación Clean:** El backend compila sin errores usando `mvn clean package` y el frontend descarga y compila con `npm run build`.

---

## 💾 2. Persistencia y Base de Datos (Flyway & PostgreSQL)

- [ ] **Migraciones Exitosas:** Al arrancar el backend, Flyway aplica todas las migraciones en la carpeta `db/migration` sin generar errores de consistencia.
- [ ] **Validación de Esquema:** Las tablas críticas (`users`, `events`, `user_events`, `venues`, `guests`) existen físicamente en la base de datos PostgreSQL.
- [ ] **Volumen Persistente:** Al apagar (`docker compose down`) y encender (`docker compose up`) el entorno, los datos de los usuarios y eventos se mantienen persistidos en el volumen Docker de la base de datos.

---

## 🔐 3. Seguridad y Control de Acceso (Spring Security & JWT)

- [ ] **Encriptación de Contraseñas:** Al registrar un nuevo usuario (`/api/auth/register`), la contraseña se encripta usando **BCrypt** antes de almacenarse en la base de datos (`password_hash`).
- [ ] **Generación de JWT:** El endpoint `/api/auth/login` retorna un token JWT válido tras ingresar credenciales correctas.
- [ ] **Rutas Protegidas:** Intentar acceder a endpoints como GET o POST `/api/events` sin el header `Authorization: Bearer <JWT>` retorna HTTP **401 Unauthorized**.
- [ ] **Rutas Públicas:** Rutas públicas como `/api/auth/login`, `/api/auth/register` y `/rsvp/{token}` permiten acceso sin necesidad de enviar tokens JWT.

---

## 🌐 4. Validación de Integración API (Frontend vs Backend)

- [ ] **Consistencia de Rutas:** El frontend apunta a la URL base correcta del backend local (por defecto, `http://localhost:8080/api`).
- [ ] **DTOs Coherentes:** La estructura JSON enviada por el frontend y la esperada por el backend en las APIs de Registro y Creación de Eventos coinciden (evitando errores de deserialización HTTP 400).
- [ ] **Manejo de Errores en UI:** Si el backend responde con un error HTTP (ej. 401 Credenciales incorrectas o 409 Correo duplicado), la UI del frontend muestra un mensaje de advertencia amigable en lugar de quedarse congelada o fallar.
- [ ] **Almacenamiento Local (Local Storage):** Tras un inicio de sesión exitoso, el frontend almacena de forma segura en `localStorage` el token JWT (`nexevent_token`) y los datos del usuario (`nexevent_user`).

---

## 🎯 5. Reglas de Negocio Críticas (RNs)

- [ ] **RN04 (Fecha Futura):** Intentar crear un evento con una fecha en el pasado o presente retorna HTTP **400 Bad Request** con el mensaje de error correspondiente.
- [ ] **RN09 (Tipos de Eventos Fijos):** Intentar crear un evento con un tipo diferente a `Boda`, `Quinceañero` o `Empresarial` es rechazado por la validación del sistema.
- [ ] **RN05 (Propietario del Evento):** Al listar eventos (GET `/api/events`), solo se muestran los eventos que pertenecen al organizador autenticado (no se mezclan eventos de otros usuarios).
- [ ] **RN07 (Aforo del Evento vs Invitados):** Al agregar invitados en el backend (cuando esté integrado), el sistema impide registrar más personas que el aforo total del evento.

---

## 📊 6. Calidad de Código y Estática (QA Automático)

- [ ] **Linter Frontend:** Ejecutar `npm run lint` en el directorio frontend no arroja errores bloqueantes de formato o TypeScript.
- [ ] **Análisis Estático Backend:** El backend pasa las revisiones de estilo de Checkstyle (`mvn checkstyle:check`) y de patrones sospechosos de SpotBugs (`mvn spotbugs:check`).
- [ ] **Reporte de Cobertura:** Ejecutar pruebas del backend genera correctamente el archivo de reporte de Jacoco en `target/site/jacoco/index.html`.
