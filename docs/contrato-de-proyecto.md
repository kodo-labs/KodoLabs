# Contrato de proyecto

*Responsable de redacción: Scrum Master. Cada sección debe tener al menos 5 líneas donde se indique.*

---

## 1. Escenario elegido y por qué lo eligieron

Elegimos la **Opción C: Sistema de reservas para espacio de coworking**. El escenario plantea un espacio de coworking donde hoy las reservas de salas y escritorios se gestionan por WhatsApp, lo que genera conflictos de doble reserva y poca visibilidad para miembros y administradores. Nos interesó porque el problema es claro y acotado: hace falta una aplicación web que centralice la disponibilidad en un calendario semanal, permita reservar y cancelar con confirmación, y dé a los administradores la posibilidad de gestionar recursos y bloquear horarios. Es un dominio que entendemos rápido (reservas, recursos, calendario) y tiene suficiente complejidad para aplicar patrones de diseño, pruebas y buenas prácticas a lo largo del cuatrimestre. Además, las funcionalidades mínimas (ver disponibilidad, reservas, historial, gestión de recursos, bloqueos) se pueden repartir bien entre los cuatro integrantes y alinean con los entregables de la materia (TP1, TP2, integrador).

---

## 2. Metodología de desarrollo elegida y justificación técnica

Elegimos **Scrum con tablero Kanban** para gestionar el trabajo: sprints alineados con las fechas de la materia y un tablero visible para todo el equipo y el docente. Con cuatro integrantes y roles definidos (Scrum Master, Dev Lead, QA Lead, UX Lead), Scrum nos da ceremonia justa sin sobrecarga: reuniones cortas, backlog priorizado y entregas en hitos (TP1 patrones, TP2 pruebas, integrador). El tablero Kanban cumple con lo que pide la guía (5 columnas, backlog con tarjetas por epic y responsable) y nos obliga a mantener el estado del trabajo visible. La justificación técnica es que necesitamos trazabilidad entre lo que hacemos y lo que se evalúa (decisiones de diseño, pruebas, código), y tener un contrato y un tablero desde la Semana 1 reduce la deuda técnica y facilita los reportes semanales y las defensas en coloquio.

---

## 3. Roles asignados con nombre de cada integrante

| Rol           | Nombre            |
|---------------|-------------------|
| Scrum Master  | Franco Olexyn     |
| Dev Lead      | Santino Martins   |
| QA Lead       | Santiago Tarnoski |
| UX Lead       | Santino Roa       |

---

## 4. Acuerdos de trabajo del equipo

- **Horarios de reunión / disponibilidad:** Reuniones de sincronización según necesidad (preferentemente en horario de clase o acordado por el grupo). Cada uno comunica disponibilidad en el canal del equipo. Antes de cada entrega (TP1, TP2, integrador) se coordina al menos una reunión para revisar estado y repartir tareas.
- **Canales de comunicación:** Grupo de WhatsApp para coordinación rápida, avisos y dudas del día a día. GitHub (issues, PRs, tablero) para el trabajo técnico y la trazabilidad. Los enlaces importantes (repo, tablero, reportes) se comparten también por WhatsApp para que todos tengan acceso.
- **Frecuencia de commits:** Al menos un commit por tarea o por bloque de trabajo con sentido (no subir todo de golpe). Mensajes de commit claros (qué se hizo o en qué tarea se trabaja). El Dev Lead puede definir convenciones extra si hace falta (por ejemplo ramas por feature).
- **Criterios para mover tarjetas en el tablero:** El responsable de la tarea mueve la tarjeta: Backlog → En curso cuando empieza a trabajar; En curso → En revisión cuando termina y (si aplica) abre PR o pide revisión; En revisión → Hecho cuando está integrado o aceptado. Si hay dudas, se acuerda en el grupo. El tablero debe reflejar el estado real para los reportes y para el docente.

*Ajustar horarios y canal si el equipo define algo distinto.*
