# [BUG-XXX] Título Descriptivo y Conciso del Error

* **Historia de Usuario Asociada:** US-XX / [SCRUM-XXX]
* **Módulo Afectado:** (Auth / Events / Venues / Guests / etc.)
* **Entorno de Prueba:** Local Docker / Staging
* **Fecha de Reporte:** AAAA-MM-DD
* **QA Tester:** (Tu Nombre/Usuario)

---

## 📝 Descripción del Error
Proporciona una explicación breve y técnica de lo que ocurre. Ejemplo: *"El endpoint de registro acepta contraseñas vacías, lo que viola la validación básica del lado del servidor."*

---

## 👣 Pasos para Reproducir
Indica de forma clara y secuencial cómo recrear el error:
1. Ir a / Levantar la aplicación local.
2. Ejecutar la petición en Postman o realizar la acción en la UI.
3. Enviar el siguiente payload de datos:
   ```json
   {
     "campo": "valor"
   }
   ```
4. Observar la respuesta del servidor o la reacción de la UI.

---

## 📥 Datos de Entrada (Payload / Parámetros)
Si aplica, incluye los datos exactos que desencadenan el bug (JSON, Query Params, Headers, etc.):
```json
// Coloca el JSON exacto aquí
```

---

## 🔄 Comportamiento Esperado
Describe qué debería ocurrir según los requerimientos y el contrato OpenAPI:
* Código HTTP esperado (ej: `201 Created` o `400 Bad Request`).
* Formato y estructura de la respuesta JSON esperada.
* Comportamiento esperado en la UI (ej: mensaje de éxito y redirección).

---

## ⚠️ Comportamiento Observado (Real)
Describe qué ocurre en realidad al ejecutar los pasos anteriores:
* Código HTTP real obtenido (ej: `500 Internal Server Error` o `200 OK`).
* Mensaje de error real o stacktrace obtenido.
* Comportamiento observado en la UI (ej: la pantalla se queda en blanco, error no manejado).

---

## 📸 Evidencias
Inserta enlaces a las imágenes o videos de prueba:
* ![Captura de Pantalla / Evidencia](ruta_a_la_imagen_o_video)

---

## 📊 Severidad y Prioridad

* **Severidad:** (Bloqueante / Crítica / Mayor / Menor / Cosmética)
  * *Bloqueante:* Impide probar otros módulos o cuelga el sistema.
  * *Crítica:* Falla una funcionalidad clave sin alternativa de bypass.
  * *Mayor:* Error en lógica de negocio importante pero con bypass.
  * *Menor:* Desviación de estilo, mensajes de error confusos, etc.
* **Prioridad:** (Alta / Media / Baja)
  * *Alta:* Debe corregirse inmediatamente para continuar el ciclo.
  * *Media:* Debe corregirse antes de la entrega final.
  * *Baja:* Corrección cosmética o de baja visibilidad.

---

## 🔄 Historial de Estado del Ticket (Simulado para Jira)
* [ ] **To Do / Backlog:** Bug reportado y en espera de triaje.
* [ ] **In Progress:** Asignado a desarrollo para su corrección.
* [ ] **In QA / Ready for Retest:** Corregido por desarrollo y listo para verificar por QA.
* [ ] **Closed / Done:** Validado y cerrado exitosamente por QA.
