# Matriz de Trazabilidad de QA — NextEvent

Este documento establece la trazabilidad entre las **Historias de Usuario (US)** registradas en Jira y los **Casos de Prueba Funcionales (TC)** diseñados para su validación en la plataforma NextEvent.

---

## 📊 Matriz de Requerimientos vs Casos de Prueba

| ID Jira | Historia de Usuario (US) | ID Caso de Prueba | Nombre del Caso de Prueba | Tipo de Prueba | Estado de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SCRUM-367** | US-08: Registro de nueva cuenta | **TC-AUTH-01** | Registro exitoso de organizador (API & UI) | Funcional Positivo | PASS |
| | | **TC-AUTH-02** | Registro fallido por correo duplicado (API) | Funcional Negativo | PASS |
| | | **TC-AUTH-03** | Registro fallido por campos vacíos o nulos (API) | Límite / Negativo | PASS |
| **SCRUM-362** | US-01: Inicio de sesión | **TC-AUTH-04** | Login exitoso del organizador (API & UI) | Funcional Positivo | PASS |
| | | **TC-AUTH-05** | Login fallido por contraseña incorrecta (API) | Funcional Negativo | PASS |
| | | **TC-AUTH-06** | Login fallido por correo no registrado (API) | Funcional Negativo | PASS |
| **SCRUM-373** | US-02: Creación de evento | **TC-EVENT-01** | Creación exitosa de evento (API & UI) | Funcional Positivo | PASS |
| | | **TC-EVENT-02** | Creación fallida por fecha en el pasado (RN04) | Regla de Negocio | PASS |
| | | **TC-EVENT-03** | Creación fallida por tipo de evento inválido (RN09)| Regla de Negocio | PASS |
| | | **TC-EVENT-04** | Creación fallida por aforo o presupuesto negativo | Límite / Negativo | PASS |
| **SCRUM-378** | US-03: Generación IA de cronograma | **TC-EVENT-05** | Consulta exitosa de cronograma generado (UI) | Usabilidad (Hardcoded) | PASS |
| **SCRUM-400** | US-12: Editar evento | **TC-EVENT-06** | Intento de edición de evento (API) | Brecha Backend | BLOQUEADO |
| **SCRUM-405** | US-13: Eliminar evento | **TC-EVENT-07** | Intento de eliminación de evento (API) | Brecha Backend | BLOQUEADO |
| **SCRUM-450** | US-06: Confirmación de asistencia| **TC-RSVP-01** | Confirmación RSVP vía enlace con token (UI) | Usabilidad (Hardcoded) | PASS |
| **SCRUM-460** | US-15: Subida de fotos | **TC-PHOTO-01** | Carga de fotos del evento realizado (UI) | Usabilidad (Hardcoded) | PASS |

---

## 📌 Leyenda de Estados de Ejecución
*   **PASS:** El caso de prueba ha sido ejecutado y cumple con los criterios de aceptación en el backend actual o la interfaz simulada.
*   **FAIL:** El caso de prueba falló al ejecutarse (comportamiento observado no coincide con el esperado).
*   **BLOQUEADO:** El caso de prueba no se puede ejecutar dinámicamente debido a la falta de endpoints del backend (Brecha técnica).
