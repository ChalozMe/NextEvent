# Pruebas del Sistema
# NextEvent

## 1. Introducción

El presente documento describe las pruebas realizadas sobre la aplicación NextEvent con el objetivo de verificar el correcto funcionamiento de sus principales funcionalidades.

Las pruebas permitieron validar la interacción entre frontend y backend, la correcta ejecución de los módulos desarrollados y el cumplimiento de los requisitos establecidos.

---

# 2. Estrategia de Pruebas

Las pruebas fueron realizadas mediante validaciones funcionales y revisiones del comportamiento del sistema.

Se consideraron los siguientes tipos de pruebas:

- Pruebas funcionales.
- Pruebas de integración.
- Pruebas de interfaz.
- Pruebas de calidad de código.

---

# 3. Pruebas Funcionales

## 3.1 Módulo Login

### Objetivo

Verificar el correcto acceso de los usuarios registrados al sistema.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Correo electrónico y contraseña |
| Acción | Iniciar sesión |
| Resultado esperado | Usuario autenticado correctamente |
| Resultado obtenido | Acceso al sistema mediante Dashboard |

---

## 3.2 Dashboard

### Objetivo

Validar la navegación hacia los diferentes módulos del sistema.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Usuario autenticado |
| Acción | Seleccionar opciones del menú |
| Resultado esperado | Acceso correcto a las funcionalidades |
| Resultado obtenido | Navegación correcta entre módulos |

---

## 3.3 Crear Evento

### Objetivo

Comprobar el registro de nuevos eventos.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Datos del evento |
| Acción | Registrar evento |
| Resultado esperado | Evento creado correctamente |
| Resultado obtenido | Evento almacenado y mostrado en el sistema |

---

## 3.4 Cronograma IA

### Objetivo

Validar la generación y visualización del cronograma.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Información del evento |
| Acción | Solicitar generación del cronograma |
| Resultado esperado | Mostrar planificación generada |
| Resultado obtenido | Cronograma mostrado mediante servicio simulado |

---

## 3.5 Catálogo de Locales

### Objetivo

Verificar la consulta de locales disponibles.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Acceso al módulo locales |
| Acción | Visualizar catálogo |
| Resultado esperado | Mostrar información de locales |
| Resultado obtenido | Visualización correcta de opciones disponibles |

---

## 3.6 Gestión RSVP

### Objetivo

Validar la administración de invitados.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Datos del invitado |
| Acción | Registrar o modificar invitado |
| Resultado esperado | Información actualizada correctamente |
| Resultado obtenido | Gestión correcta de invitados |

---

## 3.7 Galería

### Objetivo

Verificar la visualización de contenido multimedia.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Evento seleccionado |
| Acción | Acceder a galería |
| Resultado esperado | Mostrar contenido asociado |
| Resultado obtenido | Visualización correcta |

---

## 3.8 Calificaciones

### Objetivo

Comprobar el registro de evaluaciones.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Comentario o valoración |
| Acción | Registrar calificación |
| Resultado esperado | Información guardada correctamente |
| Resultado obtenido | Calificación registrada |

---

## 3.9 Configuración

### Objetivo

Validar la modificación de preferencias del usuario.

### Caso de prueba

| Campo | Descripción |
|---|---|
| Entrada | Datos de configuración |
| Acción | Actualizar configuración |
| Resultado esperado | Cambios aplicados correctamente |
| Resultado obtenido | Configuración actualizada |

---

# 4. Pruebas de Integración

Se verificó la comunicación entre los diferentes componentes del sistema:

## Frontend - Backend

Se validó:

- Envío correcto de solicitudes HTTP.
- Recepción de respuestas del servidor.
- Manejo adecuado de información mediante JSON.

## Backend - Base de Datos

Se verificó:

- Persistencia correcta de información.
- Acceso mediante Spring Data JPA.
- Manejo de entidades mediante Hibernate.

---

# 5. Pruebas de Seguridad

Se realizaron validaciones relacionadas con la seguridad del sistema:

## Autenticación

Se verificó:

- Acceso únicamente mediante usuarios registrados.
- Protección de rutas privadas.
- Manejo de sesiones mediante JWT.

## Protección de contraseñas

Se validó el almacenamiento seguro mediante BCrypt.

Las contraseñas no son almacenadas directamente, sino mediante funciones de hashing.

---

# 6. Pruebas de Calidad de Código

Durante el desarrollo se aplicaron prácticas para mejorar la calidad del software.

Se verificó:

- Uso correcto de TypeScript mediante interfaces.
- Separación de responsabilidades.
- Uso de servicios independientes.
- Organización modular del código.
- Manejo seguro de errores.
- Uso de DTO en backend.
- Inyección de dependencias mediante constructores.

---

# 7. Integración Continua

El proyecto incorpora procesos automatizados mediante herramientas DevOps.

## CI

El pipeline de integración continua permite:

- Compilar el backend.
- Ejecutar verificaciones mediante Maven.
- Analizar calidad del código.
- Validar compilación del frontend.
- Ejecutar pruebas antes de integrar cambios.

## CD

El pipeline de entrega continua permite preparar la construcción y despliegue mediante Docker.

---

# 8. Control de Versiones

Se verificó el correcto uso de Git Flow:

- Desarrollo mediante ramas independientes.
- Uso de Pull Requests.
- Revisión antes de integración.
- Eliminación de ramas después del merge.
- Separación de cambios mediante prefijos:

  - feature/
  - infra/
  - ci/
  - docs/

---

# 9. Resultados de las Pruebas

Las pruebas realizadas permitieron comprobar que:

- Los módulos principales funcionan correctamente.
- La navegación entre componentes es adecuada.
- La comunicación frontend-backend funciona correctamente.
- La información es procesada de forma segura.
- El sistema cumple con los objetivos planteados.

---

# 10. Conclusiones

Las pruebas realizadas permitieron validar la estabilidad y funcionamiento general de NextEvent.

La aplicación cuenta con una estructura organizada, buenas prácticas de desarrollo y mecanismos que facilitan futuras ampliaciones y mantenimiento del sistema.