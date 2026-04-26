# Estrategia de Pruebas de Software
## Proyecto A: Plataforma Web de Coworking
### Gestión de Espacios, Reservas y Miembros

---

## 1. Pruebas Unitarias

### Módulo elegido: Motor de Reservas (`reservaService.crearReserva()`)

La función `crearReserva(memberId, espacioId, fechaInicio, fechaFin, capacidad)` es el núcleo del sistema. Valida disponibilidad, controla capacidades y registra la reserva. Es el candidato ideal para pruebas unitarias por su alta criticidad y lógica condicional compleja.

---

### Clases de Equivalencia y Valores Límite

#### Parámetro: `capacidad` (número de personas, mín. 1, máx. 20)

| Clase | Descripción | Valores representativos |
|---|---|---|
| **Válida** | Capacidad dentro del rango permitido | 1, 10, 20 |
| **Inválida baja** | Capacidad menor al mínimo | 0, -1, -100 |
| **Inválida alta** | Capacidad mayor al máximo | 21, 50, 999 |
| **Valor límite inferior** | Exactamente en el borde mínimo | 1 |
| **Valor límite superior** | Exactamente en el borde máximo | 20 |
| **Frontera inferior inválida** | Un paso por debajo del mínimo | 0 |
| **Frontera superior inválida** | Un paso por encima del máximo | 21 |

#### Parámetro: `fechaInicio` / `fechaFin`

| Clase | Descripción | Ejemplo |
|---|---|---|
| **Válida** | `fechaFin` posterior a `fechaInicio`, ambas en el futuro | inicio: hoy+1h, fin: hoy+3h |
| **Inválida: rango invertido** | `fechaFin` anterior a `fechaInicio` | inicio: 14:00, fin: 10:00 |
| **Inválida: fecha pasada** | `fechaInicio` en el pasado | inicio: ayer |
| **Límite: misma fecha/hora** | `fechaInicio` == `fechaFin` | inicio == fin |

---

### Casos de Prueba Unitaria

#### Caso 1 — Clase válida + valor límite inferior de capacidad

```
DADO que el miembro M1 tiene cuenta activa
  Y el espacio E1 está disponible el día D
CUANDO se invoca crearReserva(M1, E1, "09:00", "11:00", capacidad=1)
ENTONCES se espera:
  - Resultado: reserva creada exitosamente
  - ID de reserva generado (no nulo)
  - Estado de reserva: "CONFIRMADA"
  - Espacio E1 marcado como no disponible en ese rango horario
```

**Técnica combinada:** clase válida de miembro/espacio + valor límite inferior de capacidad (1).

---

#### Caso 2 — Clase inválida + valor límite superior + 1

```
DADO que el miembro M1 tiene cuenta activa
  Y el espacio E1 tiene capacidad máxima de 20
CUANDO se invoca crearReserva(M1, E1, "09:00", "11:00", capacidad=21)
ENTONCES se espera:
  - Excepción lanzada: CapacidadExcedidaException
  - Mensaje: "La capacidad solicitada supera el máximo permitido (20)"
  - Ningún registro creado en base de datos
  - Estado del espacio E1 no modificado
```

**Técnica combinada:** clase inválida alta de capacidad + valor límite superior+1 (21).

---

#### Caso 3 — Clase inválida de fechas (rango invertido)

```
DADO que el miembro M1 tiene cuenta activa
  Y el espacio E1 está disponible
CUANDO se invoca crearReserva(M1, E1, fechaInicio="15:00", fechaFin="10:00", capacidad=5)
ENTONCES se espera:
  - Excepción lanzada: RangoFechaInvalidoException
  - Mensaje: "La fecha de fin debe ser posterior a la fecha de inicio"
  - Sin efecto en la base de datos ni en el estado del espacio
```

**Técnica combinada:** clase inválida de rango de fechas + valor de frontera (fechas iguales también debería fallar).

---

### Framework de Pruebas Unitarias Recomendado: **Jest**

**Justificación:**

La plataforma de coworking se desarrollará con un stack basado en **Node.js + React** (frontend) y **Express.js** (backend), lo que hace de Jest la elección natural por las siguientes razones:

- **Integración nativa** con el ecosistema JavaScript/TypeScript sin configuración adicional.
- **Cobertura de código incorporada** (`jest --coverage`) sin dependencias externas.
- **Mocking integrado** (`jest.fn()`, `jest.mock()`), lo que simplifica el aislamiento de módulos.
- **Snapshot testing** útil para verificar la integridad de respuestas JSON de la API.
- **Velocidad:** ejecuta pruebas en paralelo con workers aislados.
- **Comunidad y documentación** extensas; mantenido por Meta, ampliamente adoptado en proyectos de escala media.
- **Gratuito y open source** bajo licencia MIT.

Alternativa descartada: Mocha + Chai requieren configuración adicional y combinación de librerías; Jest ofrece todo en uno.

---

## 2. Pruebas de Integración

### Dependencias Externas Identificadas

| # | Dependencia | Tipo | Rol en el sistema |
|---|---|---|---|
| 1 | Base de datos PostgreSQL | BD relacional | Persistencia de reservas, miembros, espacios |
| 2 | Pasarela de pago (Stripe) | API de terceros | Cobro de membresías y reservas |
| 3 | Servicio de autenticación (Auth0 / JWT) | Servicio externo | Login, tokens, control de sesión |
| 4 | Servicio de notificaciones (SendGrid) | API de terceros | Emails de confirmación de reserva |

Para las pruebas de integración se aíslan las dependencias 2, 3 y 4 con **mocks/stubs**, y se usa una base de datos en memoria o de prueba para la dependencia 1.

---

### Uso de Mocks y Stubs: Ejemplo Concreto

**Escenario:** probar el flujo `POST /api/reservas` sin llamar a Stripe ni a SendGrid.

```javascript
// pseudocódigo con Jest + módulos mockeados

// ── Configuración ──────────────────────────────────────────
jest.mock('../services/stripeService');         // stub de Stripe
jest.mock('../services/emailService');          // stub de SendGrid
jest.mock('../services/authService');           // stub de Auth0

const stripeService  = require('../services/stripeService');
const emailService   = require('../services/emailService');
const reservaService = require('../services/reservaService');

// ── Caso: reserva exitosa con pago aprobado ────────────────
describe('POST /api/reservas - integración', () => {

  beforeEach(() => {
    // El stub simula que Stripe aprueba el cobro
    stripeService.cobrar.mockResolvedValue({ status: 'succeeded', chargeId: 'ch_test_001' });

    // El stub simula que SendGrid envía el email OK
    emailService.enviarConfirmacion.mockResolvedValue({ messageId: 'msg_001' });
  });

  test('debe crear reserva, registrar cobro y enviar email de confirmación', async () => {
    const payload = {
      memberId: 'M1',
      espacioId: 'E1',
      fechaInicio: '2025-06-01T09:00:00',
      fechaFin: '2025-06-01T11:00:00',
      capacidad: 5,
    };

    const resultado = await reservaService.crearReserva(payload);

    // Verificaciones sobre el módulo bajo prueba
    expect(resultado.estado).toBe('CONFIRMADA');
    expect(resultado.chargeId).toBe('ch_test_001');

    // Verificar que los dobles fueron invocados correctamente
    expect(stripeService.cobrar).toHaveBeenCalledWith(expect.objectContaining({ memberId: 'M1' }));
    expect(emailService.enviarConfirmacion).toHaveBeenCalledOnce();
  });

  test('debe rechazar reserva si Stripe devuelve fondos insuficientes', async () => {
    stripeService.cobrar.mockRejectedValue(new Error('insufficient_funds'));

    await expect(reservaService.crearReserva({ memberId: 'M1', espacioId: 'E1', ... }))
      .rejects.toThrow('insufficient_funds');

    // El email no debe enviarse si el pago falló
    expect(emailService.enviarConfirmacion).not.toHaveBeenCalled();
  });
});
```

**Ventaja del enfoque:** el test valida la lógica de orquestación de `reservaService` sin depender de la red, sin cargo real a tarjetas y sin consumir cuota de SendGrid.

---

### Herramienta Recomendada: **Jest + Supertest + node-pg para BD de prueba**

- **Jest** provee el sistema de mocking (`jest.mock`, `mockResolvedValue`, `mockRejectedValue`).
- **Supertest** permite hacer peticiones HTTP reales al servidor Express en memoria, sin levantar un puerto.
- **Base de datos de prueba:** se usa una instancia PostgreSQL local con schema aislado que se limpia entre suites (`beforeAll` / `afterAll`), o **pg-mem** para una BD en memoria pura.
- Para mockear APIs REST externas como Stripe también puede usarse **WireMock** (Java) o **msw (Mock Service Worker)**, que intercepta a nivel de fetch/XHR sin modificar el código fuente.

Opción adicional evaluada: **Supertest + msw** es una combinación moderna y recomendada para proyectos Node.js cuando se quiere interceptar llamadas HTTP salientes de forma declarativa.

---

## 3. Pruebas de Componentes y de Sistema

### Componente: Motor de Reservas (Booking Engine)

**Alcance:** Incluye los módulos `reservaController`, `reservaService`, `disponibilidadChecker`, `reservaRepository` y su integración con la BD de prueba. Excluye autenticación, pagos y notificaciones (mockeados).

#### Entradas
- Datos de reserva (memberId, espacioId, fechas, capacidad)
- Estado actual de la BD (espacios disponibles, reservas existentes)
- Token de sesión simulado (stub de auth)

#### Salidas esperadas
- Objeto de reserva creado con ID, estado y timestamps
- Cambio de disponibilidad del espacio en BD
- Respuesta HTTP con código 201 y body correcto
- En caso de conflicto: HTTP 409 con mensaje descriptivo

#### Entorno necesario
- PostgreSQL de prueba con schema `coworking_test`
- Seeds de datos: 3 espacios, 5 miembros activos, 2 reservas preexistentes
- Variables de entorno de prueba (`.env.test`)

---

### Flujo Completo de Usuario (Camino Feliz) — Prueba de Sistema

**Flujo: Registro → Búsqueda → Reserva → Pago → Confirmación**

| Paso | Acción del usuario | Validación |
|---|---|---|
| 1 | Usuario visita `/registro` y completa el formulario | Formulario renderiza sin errores; campos requeridos validados |
| 2 | Envía formulario de registro | HTTP 201; email de bienvenida enviado; redirección a `/dashboard` |
| 3 | Busca espacios disponibles para una fecha | Listado muestra solo espacios libres; filtros funcionan |
| 4 | Selecciona un espacio y hace clic en "Reservar" | Modal de reserva abre con datos correctos del espacio |
| 5 | Completa fechas y capacidad; confirma | Validaciones en tiempo real activas; botón habilitado solo con datos válidos |
| 6 | Ingresa datos de tarjeta (Stripe Elements) | Stripe tokeniza la tarjeta; no hay datos sensibles en el servidor propio |
| 7 | Confirma el pago | HTTP 200; reserva aparece en "Mis reservas"; espacio marcado como ocupado |
| 8 | Recibe email de confirmación | Email contiene número de reserva, espacio, fechas y QR de acceso |

---

### Comparativa de Herramientas E2E

| Criterio | Cypress | Playwright | Selenium |
|---|---|---|---|
| **Velocidad de ejecución** | Alta (mismo proceso) | Muy alta (nativa por browser) | Baja/media (WebDriver) |
| **Curva de aprendizaje** | Baja | Media | Alta |
| **Soporte multi-browser** | Limitado (no Safari real) | Completo (Chrome, FF, Safari, Edge) | Completo |
| **Modo headless** | Sí | Sí | Sí |
| **Debugging** | Excelente (Time Travel) | Bueno (Trace Viewer) | Básico |
| **Paralelismo gratuito** | Limitado en plan free | Ilimitado (open source puro) | Ilimitado |
| **Soporte TypeScript** | Parcial (requiere config) | Nativo | Parcial |
| **Integración CI** | Buena | Excelente | Buena |
| **Licencia** | MIT | Apache 2.0 | Apache 2.0 |

**Herramienta elegida: Playwright**

**Justificación:** El coworking es una plataforma web que debe funcionar correctamente en Chrome (usuarios corporativos), Firefox y Safari (usuarios con MacOS/iOS). Playwright es la única herramienta gratuita que cubre los tres motores de browser con APIs modernas y sin coste de licencia. Su Trace Viewer facilita el debugging en CI, y su integración con GitHub Actions es directa. Además, al ser open source puro sin plan de pago, no hay riesgo de funcionalidades bloqueadas en entornos de equipo pequeño.

---

## 4. Pruebas de Regresión y de Estrés

### Estrategia de Regresión

#### Suite de pruebas automatizadas por tipo de cambio

```
Cambio en código fuente
        │
        ▼
┌──────────────────────────────────────────────────┐
│ SIEMPRE (en cada PR / push)                      │
│  • Pruebas unitarias completas (Jest)            │
│  • Pruebas de integración del módulo modificado  │
│  • Linting y análisis estático (ESLint, SonarJS) │
└──────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────┐
│ EN MERGE A MAIN / STAGING                        │
│  • Suite E2E de caminos felices (Playwright)     │
│  • Suite E2E de casos críticos negativos         │
│  • Smoke tests de API (Supertest)                │
└──────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────┐
│ SEMANAL / NOCTURNO                               │
│  • Suite de regresión completa E2E               │
│  • Pruebas de estrés (k6)                        │
│  • Reporte de cobertura consolidado              │
└──────────────────────────────────────────────────┘
```

#### Integración CI/CD con GitHub Actions

```yaml
# .github/workflows/ci.yml (esquema simplificado)
name: CI Pipeline

on: [push, pull_request]

jobs:
  unit-and-integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: coworking_test
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage        # Jest

  e2e:
    runs-on: ubuntu-latest
    needs: unit-and-integration
    steps:
      - uses: actions/checkout@v4
      - run: npx playwright install --with-deps
      - run: npm run test:e2e              # Playwright

  stress:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: k6 run tests/stress/reservas.js
```

**Criterio de calidad:** un PR no puede mergear si cualquier prueba unitaria o de integración falla. Las pruebas E2E son obligatorias para deploy a producción.

---

### Escenario de Prueba de Estrés

**Escenario: Apertura de reservas para la temporada alta**

> El primer día hábil de cada mes, la plataforma habilita los espacios premium para el mes siguiente. Históricamente, en los primeros 2 minutos se registran picos de hasta **500 solicitudes de reserva simultáneas**.

#### Métricas objetivo

| Métrica | Umbral aceptable |
|---|---|
| Tiempo de respuesta P95 | < 2 segundos |
| Tiempo de respuesta P99 | < 4 segundos |
| Tasa de errores | < 1% |
| Throughput | > 200 req/s sostenido |
| Sin deadlocks en BD | 0 conflictos de transacción |

---

### Comparativa de Herramientas de Estrés

| Criterio | JMeter | k6 | Gatling | Locust |
|---|---|---|---|---|
| **Lenguaje de scripts** | XML/GUI | JavaScript | Scala | Python |
| **Curva de aprendizaje** | Alta | Baja | Media | Baja |
| **Rendimiento (VU)** | Medio | Muy alto | Alto | Medio |
| **Integración CI** | Compleja | Nativa | Buena | Buena |
| **Reportes** | Básico (plugin) | Integrado + Grafana | HTML detallado | Web UI en tiempo real |
| **Licencia** | Apache 2.0 | AGPL v3 (OSS) | Apache 2.0 | MIT |
| **Protocolo HTTP/2** | Limitado | Nativo | Sí | Sí |

**Herramienta elegida: k6**

**Justificación:** El equipo ya trabaja con JavaScript, por lo que los scripts de k6 tienen curva de aprendizaje mínima. k6 soporta HTTP/2 (Stripe lo requiere), se integra nativamente con GitHub Actions con una sola línea, y permite exportar métricas a Grafana Cloud (plan gratuito) para visualización en tiempo real. Su motor escrito en Go lo hace considerablemente más eficiente en recursos que JMeter para simular miles de usuarios virtuales desde una sola máquina.

```javascript
// tests/stress/reservas.js — ejemplo k6
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Rampa de subida
    { duration: '60s', target: 500 },   // Pico máximo: 500 VU
    { duration: '30s', target: 0 },     // Bajada
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // P95 < 2s
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
  },
};

export default function () {
  const res = http.post('https://staging.coworking.app/api/reservas', JSON.stringify({
    memberId: `M${Math.floor(Math.random() * 1000)}`,
    espacioId: 'E1',
    fechaInicio: '2025-07-01T09:00:00',
    fechaFin: '2025-07-01T11:00:00',
    capacidad: 2,
  }), { headers: { 'Content-Type': 'application/json' } });

  check(res, { 'status es 201 o 409': (r) => [201, 409].includes(r.status) });
  sleep(1);
}
```

---

## 5. Stack Definitivo y Hoja de Ruta

### Tabla: Stack de Pruebas

| Nivel de prueba | Herramienta elegida | ¿Qué automatiza en el proyecto? | Justificación |
|---|---|---|---|
| **Unitarias** | **Jest** | Lógica de `reservaService`, validaciones de `disponibilidadChecker`, cálculos de tarifas, transformaciones de datos | Ecosistema JavaScript nativo; mocking integrado; cobertura sin plugins; ejecuta en < 10s para suites medianas |
| **Integración** | **Jest + Supertest + msw** | Flujos HTTP de la API REST; integración del Booking Engine con BD de prueba; comportamiento ante fallos de Stripe/SendGrid simulados | Sin dependencias externas en runtime; msw intercepta HTTP a nivel de red sin tocar el código fuente; compatible con CI sin servicios adicionales |
| **Sistema / E2E** | **Playwright** | Flujos completos de usuario: registro, búsqueda de espacios, reserva, pago, cancelación, panel de administración | Multi-browser real (Chrome/FF/Safari); 100% gratuito; Trace Viewer para debug; integración directa con GitHub Actions |
| **Estrés** | **k6** | Simulación de 500 reservas simultáneas; pruebas de carga en endpoints de búsqueda y disponibilidad; validación de SLAs en staging | Scripts en JavaScript (mismo stack); motor Go de alto rendimiento; integración nativa CI; dashboards en Grafana Cloud free tier |

---

### Hoja de Ruta de Implementación — 6 Meses

#### Mes 1 — Fundamentos unitarios y cultura de testing
**Hito:** Suite unitaria operativa con cobertura > 60% en módulos core.

- Configurar Jest en el proyecto (backend y frontend)
- Escribir pruebas unitarias para `reservaService`, `disponibilidadChecker` y validadores
- Establecer umbral mínimo de cobertura en CI (60%)
- Definir convenciones de naming y estructura de carpetas de tests
- **Roles:** Desarrolladores backend (lideran), desarrollador frontend (configura Jest en React)

---

#### Mes 2 — Integración y dobles de prueba
**Hito:** Suite de integración cubre los 3 flujos principales de la API sin dependencias reales.

- Integrar Supertest para pruebas de endpoints HTTP
- Configurar msw para interceptar Stripe, SendGrid y Auth0
- Crear BD de prueba PostgreSQL con seeds automatizados
- Integrar Jest + Supertest en GitHub Actions (PR gate)
- **Roles:** Desarrolladores backend, DevOps configura el servicio PostgreSQL en CI

---

#### Mes 3 — Pruebas E2E básicas con Playwright
**Hito:** 5 flujos críticos automatizados y ejecutándose en CI en cada merge a main.

- Instalar y configurar Playwright (multi-browser)
- Automatizar camino feliz: registro → reserva → confirmación
- Automatizar flujos negativos: reserva en espacio ocupado, pago rechazado
- Configurar artifacts de Playwright (screenshots, videos, traces) en GitHub Actions
- **Roles:** QA Engineer o desarrollador designado como "testing champion"

---

#### Mes 4 — Cobertura E2E ampliada y regresión
**Hito:** Suite de regresión completa corre nocturno; cobertura E2E > 80% de casos críticos.

- Automatizar flujos de administración (gestión de espacios, reportes)
- Configurar pipeline nocturno de regresión completa
- Implementar notificaciones de fallo por Slack/email
- Revisar y eliminar pruebas frágiles (flaky tests)
- **Roles:** QA + desarrolladores (todos participan en mantenimiento de tests)

---

#### Mes 5 — Pruebas de estrés y rendimiento
**Hito:** Escenario de 500 usuarios simultáneos ejecutado y con baseline documentado.

- Instalar k6 y escribir el script de carga para el Booking Engine
- Ejecutar pruebas en ambiente staging (no en producción)
- Conectar métricas a Grafana Cloud (free tier)
- Documentar SLAs observados y detectar cuellos de botella
- Optimizar consultas SQL o configuración de conexiones según resultados
- **Roles:** DevOps + desarrollador backend senior

---

#### Mes 6 — Consolidación, revisión y mejora continua
**Hito:** Pipeline CI/CD completo y documentado; cobertura unitaria > 80%; zero flaky tests.

- Audit completo de cobertura (unitaria + integración + E2E)
- Refactorizar pruebas duplicadas o frágiles
- Documentar el stack de testing en el README del proyecto
- Establecer SLA de tiempo de ejecución del pipeline (objetivo: < 15 min total)
- Retrospectiva del equipo: ¿qué funcionó?, ¿qué ajustar?
- Planificar Fase 2: pruebas de accesibilidad (axe-playwright), pruebas de seguridad (OWASP ZAP)
- **Roles:** Todo el equipo; liderado por Tech Lead

---

#### Resumen Visual de la Hoja de Ruta

```
Mes 1   ████████░░░░░░░░░░░░░░░░  Unitarias (Jest)
Mes 2   ░░░░████████░░░░░░░░░░░░  Integración (Supertest + msw)
Mes 3   ░░░░░░░░████████░░░░░░░░  E2E básico (Playwright)
Mes 4   ░░░░░░░░░░░░████████░░░░  Regresión completa
Mes 5   ░░░░░░░░░░░░░░░░████████  Estrés (k6)
Mes 6   ░░░░░░░░░░░░░░░░░░░░████  Consolidación y deuda técnica
```

---

*Documento elaborado para la materia Ingeniería de Software — Estrategia de Pruebas — Proyecto A: Plataforma Web de Coworking.*
