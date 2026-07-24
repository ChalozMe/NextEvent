# Especificación de Requisitos

## 1. Requerimientos Funcionales (RF)

### Módulo de Autenticación

**RF01 - Inicio de Sesión**  
El sistema debe permitir a los usuarios autenticarse mediante correo electrónico y contraseña.

**RF02 - Gestión de Sesión**  
El sistema debe proteger las rutas privadas mediante autenticación basada en JSON Web Tokens (JWT).

---

### Módulo de Gestión de Eventos

**RF03 - Crear Evento**  
El sistema debe permitir al organizador crear eventos indicando el tipo de evento, fecha, presupuesto estimado y aforo.

**RF04 - Editar Evento**  
El organizador podrá modificar la información de un evento previamente registrado.

**RF05 - Eliminar Evento**  
El organizador podrá eliminar eventos registrados.

**RF06 - Dashboard**  
El sistema deberá mostrar un panel con información resumida del evento, incluyendo el porcentaje de tareas completadas y el número de invitados confirmados.

---

### Módulo de Cronograma

**RF07 - Generación de Cronograma**  
Al crear un evento, el sistema deberá generar automáticamente un cronograma inicial de tareas según el tipo de evento.

> **Nota:** La arquitectura está preparada para integrarse con un servicio de Inteligencia Artificial. En la versión actual la generación utiliza un servicio simulado (mock).

**RF08 - Gestión de Tareas**  
El organizador podrá editar las fechas límite y cambiar el estado de las tareas.

Estados permitidos:

- Pendiente
- En progreso
- Completada

---

### Módulo de Gestión de Locales

**RF09 - Catálogo de Locales**  
El sistema deberá mostrar un catálogo de locales indicando nombre, capacidad, precio referencial y valoración promedio.

**RF10 - Disponibilidad de Locales**  
El sistema permitirá consultar la disponibilidad de un local según una fecha determinada.

---

### Módulo RSVP

**RF11 - Registro de Invitados**  
El organizador podrá registrar invitados mediante sus direcciones de correo electrónico.

**RF12 - Envío de Invitaciones**  
El sistema enviará invitaciones digitales con enlaces para confirmar o rechazar la asistencia.

**RF13 - Gestión de Confirmaciones**  
El sistema almacenará el estado de cada invitado como:

- Confirmado
- Pendiente
- Rechazado

**RF14 - Lista de Asistencia**  
El organizador podrá visualizar y exportar la lista de invitados confirmados.

---

### Módulo de Galería

**RF15 - Subida de Fotografías**  
Los invitados podrán subir fotografías relacionadas con el evento.

**RF16 - Visualización de Galería**  
El sistema permitirá visualizar todas las fotografías asociadas a un evento.

---

### Módulo de Calificaciones

**RF17 - Calificación de Locales**  
Los usuarios podrán registrar una valoración del local utilizado para el evento.

---

### Módulo de Configuración

**RF18 - Configuración de Cuenta**  
El usuario podrá modificar la información básica de su cuenta.

---

## 2. Requerimientos No Funcionales (RNF)

**RNF01 - Arquitectura**  
El backend deberá desarrollarse utilizando Java 21 y Spring Boot siguiendo una arquitectura por capas.

**RNF02 - Frontend**  
La interfaz web deberá desarrollarse utilizando React y TypeScript.

**RNF03 - Persistencia**  
Toda la información será almacenada en una base de datos PostgreSQL.

**RNF04 - Seguridad**  
Las contraseñas deberán almacenarse utilizando algoritmos de encriptación seguros como BCrypt.

**RNF05 - Autenticación**  
La autenticación deberá implementarse mediante JSON Web Tokens (JWT).

**RNF06 - Migraciones**  
La base de datos será administrada mediante Flyway.

**RNF07 - Documentación de API**  
La API REST deberá documentarse mediante OpenAPI.

**RNF08 - Contenedores**  
El sistema deberá poder ejecutarse utilizando Docker y Docker Compose.

**RNF09 - Usabilidad**  
La interfaz deberá ser responsive para dispositivos móviles y de escritorio.

**RNF10 - Rendimiento**  
Las operaciones comunes deberán responder en un tiempo menor a tres segundos bajo condiciones normales.

**RNF11 - Integridad**  
El sistema deberá garantizar la integridad referencial de la información almacenada.

**RNF12 - Control de Versiones**  
Todo el desarrollo deberá mantenerse bajo control de versiones utilizando Git y GitHub.

---

## 3. Reglas de Negocio (RN)

**RN01**  
No se permitirá reservar un mismo local para dos eventos en la misma fecha.

**RN02**  
Los enlaces RSVP expirarán 48 horas antes de la fecha del evento.

**RN03**  
Solo podrán calificar un local los usuarios que hayan realizado un evento asociado a dicho establecimiento.

**RN04**  
La fecha registrada para un evento deberá ser posterior a la fecha actual.

**RN05**  
Cada evento pertenecerá únicamente a un organizador.

**RN06**  
Todas las tareas estarán asociadas a un único evento.

**RN07**  
Solo los usuarios autenticados podrán acceder al panel administrativo.

---

# 4. Historias de Usuario

## US-01 - Inicio de Sesión

**Como** usuario

**Quiero** iniciar sesión utilizando mi correo electrónico y contraseña

**Para** acceder a la plataforma y administrar mis eventos.

**Criterios de aceptación**

- Validar correo y contraseña.
- Mostrar mensaje de error cuando las credenciales sean incorrectas.
- Redirigir al Dashboard cuando el inicio de sesión sea exitoso.

---

## US-02 - Crear Evento

**Como** organizador

**Quiero** registrar un nuevo evento

**Para** comenzar la planificación de sus actividades.

**Criterios de aceptación**

- Registrar tipo de evento.
- Registrar fecha.
- Registrar presupuesto.
- Registrar aforo.
- Asociar el evento al organizador.

---

## US-03 - Generar Cronograma

**Como** organizador

**Quiero** que el sistema genere automáticamente un cronograma inicial

**Para** disponer de una planificación base para mi evento.

**Criterios de aceptación**

- Generar tareas automáticamente.
- Asociarlas al evento.
- Permitir modificar fechas y estados.
- Mantener preparada la integración futura con IA.

---

## US-04 - Consultar Locales

**Como** organizador

**Quiero** buscar locales disponibles

**Para** seleccionar el lugar adecuado para mi evento.

---

## US-05 - Gestionar Invitados

**Como** organizador

**Quiero** registrar invitados

**Para** enviar invitaciones RSVP.

---

## US-06 - Confirmar Asistencia

**Como** invitado

**Quiero** confirmar o rechazar mi asistencia mediante un enlace

**Para** informar mi decisión al organizador.

---

## US-07 - Consultar Lista de Asistencia

**Como** organizador

**Quiero** visualizar y exportar la lista de asistentes

**Para** facilitar el control de ingreso el día del evento.

---

## US-08 - Subir Fotografías

**Como** invitado

**Quiero** compartir fotografías del evento

**Para** contribuir a la galería del evento.

---

## US-09 - Calificar un Local

**Como** organizador

**Quiero** calificar el local utilizado

**Para** compartir mi experiencia con otros usuarios.

---

## US-10 - Configurar Cuenta

**Como** usuario

**Quiero** modificar mi información personal

**Para** mantener actualizados mis datos.