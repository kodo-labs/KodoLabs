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
