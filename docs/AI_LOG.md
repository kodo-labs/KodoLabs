# Registro de uso de IA (AI_LOG)

Cada vez que el grupo use una herramienta de IA (Claude, Copilot, ChatGPT, Gemini, etc.) debe agregarse una entrada en este archivo. **No es opcional.**

En el coloquio del TP1 y TP2 el docente puede abrir este archivo y preguntar sobre cualquier entrada a cualquier integrante. Si no podés explicar lo que figura acá, afecta tu nota individual, no la grupal.

---

## Formato de cada entrada

- **Entrada:** `## Entrada NNN - Semana X`
- **Herramienta:** nombre de la herramienta (ej. GitHub Copilot, Cursor, ChatGPT).
- **Responsable:** rol y nombre (ej. Dev Lead - Matías Ruiz).
- **¿Para qué se usó?:** propósito del uso.
- **¿Qué generó la IA?:** resultado directo (código, texto, etc.).
- **¿Qué modificamos y por qué?:** cambios hechos al resultado y justificación.

---

## Entradas

---

## Entrada 001 - Semana 4 (TP1 — Implementación de patrones GoF)

- **Herramienta:** Claude (Anthropic) — claude.ai
- **Responsable:** Dev Lead — Santino Martins
- **¿Para qué se usó?:**  
  Implementar el scaffolding del código del TP1: clases del dominio, patrones Observer y Factory Method, servicio principal y demo end-to-end. También para generar el borrador de la documentación `docs/patrones-tp1.md`.

- **¿Qué generó la IA?:**  
  La IA generó la estructura de archivos y el código completo de:

  | Archivo | Descripción |
  |---------|-------------|
  | `src/domain/recurso.py` | Clase abstracta base del dominio |
  | `src/domain/sala.py` | Recurso concreto Sala |
  | `src/domain/escritorio.py` | Recurso concreto Escritorio |
  | `src/domain/usuario.py` | Clases Miembro y Administrador |
  | `src/domain/reserva.py` | Clase Reserva — Subject del patrón Observer |
  | `src/patterns/observer.py` | Interfaz ObservadorReserva + implementaciones concretas |
  | `src/patterns/factory.py` | RecursoFactory abstracta + SalaFactory + EscritorioFactory |
  | `src/services/sistema_reservas.py` | Servicio principal con verificación anti-doble-reserva |
  | `src/main.py` | Demo end-to-end del sistema |
  | `docs/patrones-tp1.md` | Documentación técnica de los patrones |

- **¿Qué modificamos y por qué?:**

  **Decisiones previas a la generación (propias del equipo, no de la IA):**
  - La elección de Observer y Factory Method fue decisión del equipo, basada en el análisis del dominio.
  - La justificación técnica de por qué Observer y no Strategy/Mediator, y por qué Factory Method y no Abstract Factory/Builder, fue elaborada por el equipo antes de usar la IA.
  - La estructura del dominio (clases, relaciones) se acordó según el contrato del proyecto.

  **Ajustes realizados al código generado:**
  - Se verificó que los patrones estén integrados en el sistema real y no como ejemplos aislados.
  - Se revisaron los comentarios del código para que sean útiles durante el coloquio.
  - Se validó el funcionamiento end-to-end: crear, detectar conflicto, cancelar, ver disponibilidad.

  **Partes NO generadas con IA:**
  - La decisión de qué patrones usar y la justificación de esa elección
  - La revisión crítica del código antes de incorporarlo
  - La comprensión del código por parte de cada integrante

  > ⚠️ **Nota:** todo el código incorporado fue revisado y puede ser explicado por cualquier integrante en el coloquio.

---

## Entrada 002 - Semana 5 (UX/UI — Prototipo funcional React)

- **Herramienta:** Claude Code (Anthropic) — claude.ai/code
- **Responsable:** UX Lead — Santino Roa
- **¿Para qué se usó?:**  
  Implementar el prototipo funcional de la interfaz de usuario del sistema BookDesk: configuración del proyecto React + Vite + Tailwind, todos los componentes, las 6 pantallas principales y la documentación de diseño en `design/README.md`.

- **¿Qué generó la IA?:**  
  La IA generó la estructura de archivos y el código completo de:

  | Archivo | Descripción |
  |---------|-------------|
  | `frontend/package.json` | Dependencias del proyecto frontend |
  | `frontend/vite.config.js` | Configuración de Vite |
  | `frontend/tailwind.config.js` | Paleta de colores y configuración Tailwind |
  | `frontend/src/main.jsx` | Punto de entrada React |
  | `frontend/src/App.jsx` | Router + providers de contexto |
  | `frontend/src/index.css` | Estilos base con Tailwind |
  | `frontend/src/data/mockData.js` | Datos de prueba: usuarios, recursos, reservas |
  | `frontend/src/context/AuthContext.jsx` | Estado de autenticación |
  | `frontend/src/context/ReservationsContext.jsx` | Estado global de reservas |
  | `frontend/src/components/layout/Sidebar.jsx` | Sidebar con navegación por rol |
  | `frontend/src/components/layout/TopBar.jsx` | Barra superior |
  | `frontend/src/components/layout/Layout.jsx` | Shell de la aplicación |
  | `frontend/src/components/calendar/WeeklyCalendar.jsx` | Grilla semanal de disponibilidad |
  | `frontend/src/components/booking/ResourceCard.jsx` | Tarjeta de sala/escritorio |
  | `frontend/src/components/booking/BookingModal.jsx` | Modal de confirmación de reserva |
  | `frontend/src/components/common/Badge.jsx` | Insignia de estado de reserva |
  | `frontend/src/components/common/StatsCard.jsx` | Tarjeta de métricas (admin) |
  | `frontend/src/pages/LoginPage.jsx` | Pantalla de login con demo rápida |
  | `frontend/src/pages/DashboardPage.jsx` | Vista principal con calendario |
  | `frontend/src/pages/BookingPage.jsx` | Flujo de reserva en 2 pasos |
  | `frontend/src/pages/ReservationsPage.jsx` | Historial de mis reservas |
  | `frontend/src/pages/admin/AdminDashboardPage.jsx` | Panel administrador con métricas |
  | `frontend/src/pages/admin/AdminResourcesPage.jsx` | CRUD de recursos |
  | `design/README.md` | Documentación de diseño UX/UI |

- **¿Qué modificamos y por qué?:**

  **Decisiones previas a la generación (propias del equipo, no de la IA):**
  - La elección de React + Vite + Tailwind CSS fue decisión del equipo. Se consideró Vue y Angular, pero React tiene mayor adopción y mejor integración con el stack previsto para el integrador.
  - La estructura de pantallas (dashboard, booking, reservations, admin) fue diseñada por el UX Lead a partir del análisis del dominio y los flujos descritos en el contrato del proyecto.
  - La decisión de hacer un prototipo funcional (en lugar de Figma) fue del equipo: permite validar los flujos de usuario de forma más realista y se puede evolucionar directamente al producto final.

  **Ajustes realizados al código generado:**
  - Se verificó que la relación entre pantallas respete el flujo de usuario descrito en el contrato (ver disponibilidad → reservar → confirmar → ver historial).
  - Se revisó que los colores del calendario (verde/rojo/azul/gris) correspondan a una convención UX coherente y explicable.
  - Se validó que el flujo de admin incluya la funcionalidad de bloqueo de horarios requerida por el contrato.
  - Se comprobó que la conexión conceptual con los patrones Observer y Factory Method sea visible en la UI (pantalla de éxito del booking, renderizado diferenciado por tipo de recurso).

  **Partes NO generadas con IA:**
  - La decisión de qué pantallas son necesarias y el flujo entre ellas
  - La elección del stack tecnológico y la justificación técnica
  - La revisión crítica de los componentes generados
  - La comprensión del código por parte de cada integrante

  
