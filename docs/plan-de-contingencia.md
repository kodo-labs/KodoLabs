# 🛡️ Plan de Contingencia - Sistema de Coworking

[cite_start]Este documento detalla las acciones a seguir para mitigar y responder a los riesgos identificados en el desarrollo del sistema de gestión de espacios de coworking.

---

## 📊 Resumen de Riesgos Críticos

| Riesgo | Categoría | Probabilidad | Impacto |
| :--- | :--- | :--- | :--- |
| Curva de aprendizaje lenta (React/NestJS) | Técnico | Alta | Medio |
| Superposición de fechas académicas | De equipo | Alta | Alto |
| Ambigüedad en Historias de Usuario (Perfil) | De requisitos | Media | Medio |
| Fallos en sincronización Google Calendar | Externo | Baja | Alto |
| Falta de comunicación Frontend/Backend | De equipo | Media | Alto |

---

## 🛠️ Acciones de Mitigación y Contingencia

### 1. Curva de aprendizaje (React/NestJS) 
* [cite_start]**Riesgo:** Los perfiles Junior pueden demorar más de lo previsto en la entrega de tareas técnicas.
* **Acción Preventiva:** Implementar sesiones de *Pair Programming* entre perfiles con más experiencia y perfiles Junior.
* **Plan de Contingencia:** Si el retraso afecta el cronograma, se simplificarán los requerimientos técnicos de los módulos no críticos para priorizar el MVP.

### 2. Superposición de fechas académicas
* [cite_start]**Riesgo:** La entrega de otras materias o exámenes reduce la disponibilidad del equipo.
* **Acción Preventiva:** Mantener un calendario compartido con las fechas críticas de cada integrante del equipo.
* [cite_start]**Plan de Contingencia:** Reducción del alcance (*scope*) del Sprint durante semanas de exámenes, priorizando solo la corrección de errores críticos o documentación.

### 3. Ambigüedad en Historias de Usuario (Perfil)
* [cite_start]**Riesgo:** Definiciones poco claras que generan retrabajo en el frontend.
* **Acción Preventiva:** Realizar reuniones de refinamiento (*Backlog Grooming*) específicas para validar criterios de aceptación antes de iniciar el desarrollo.
* [cite_start]**Plan de Contingencia:** Detener el desarrollo del módulo de perfil ante la primera duda de diseño y solicitar una validación inmediata con el Product Owner para evitar desperdicio de código.

### 4. Fallos en API de Google Calendar (Overbooking)
* [cite_start]**Riesgo:** Errores de sincronización que provocan duplicidad en la reserva de escritorios.
* **Acción Preventiva:** Desarrollar una capa de validación interna en la base de datos propia que verifique disponibilidad antes de consultar la API externa.
* [cite_start]**Plan de Contingencia:** Habilitar un modo de "Gestión Manual" para que el administrador del coworking pueda resolver conflictos de reservas directamente en el sistema.

### 5. Fallos de comunicación Frontend/Backend
* [cite_start]**Riesgo:** Retrasos en la integración de servicios de la API.
* **Acción Preventiva:** Uso obligatorio de documentación con Swagger o Postman para establecer contratos de datos claros desde el inicio.
* [cite_start]**Plan de Contingencia:** Realizar reuniones diarias de sincronización técnica (*Daily Syncs*) enfocadas exclusivamente en destrabar puntos de integración.

---

> **Nota:** Este plan debe ser revisado al inicio de cada Sprint para ajustar las probabilidades e impactos según el avance del proyecto.
