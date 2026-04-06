# Diseño UX/UI — Kutz Coworking

**Responsable:** UX Lead — Santino Roa  
**Última actualización:** Abril 2026  
**Estado:** Implementado (prototipo funcional en React)

---

## Descripción general

El diseño UX/UI de Kutz se materializó como un **prototipo funcional** en React + Vite + Tailwind CSS, ubicado en la carpeta `frontend/`. No es solo un mockup estático: el prototipo es navegable, incluye datos de muestra y demuestra todos los flujos de usuario definidos en el contrato del proyecto.

---

## Estructura del frontend

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                         # Punto de entrada React
    ├── App.jsx                          # Router y providers
    ├── index.css                        # Estilos base + Tailwind
    ├── context/
    │   ├── AuthContext.jsx              # Autenticación (login/logout)
    │   └── ReservationsContext.jsx      # Estado global de reservas
    ├── data/
    │   └── mockData.js                  # Datos de prueba y helpers
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx               # Shell con sidebar
    │   │   ├── Sidebar.jsx              # Navegación lateral
    │   │   └── TopBar.jsx               # Barra superior con título
    │   ├── calendar/
    │   │   └── WeeklyCalendar.jsx       # Grilla semanal de disponibilidad
    │   ├── booking/
    │   │   ├── ResourceCard.jsx         # Tarjeta de sala/escritorio
    │   │   └── BookingModal.jsx         # Modal de confirmación
    │   └── common/
    │       ├── Badge.jsx                # Insignia de estado
    │       └── StatsCard.jsx            # Tarjeta de métricas (admin)
    └── pages/
        ├── LoginPage.jsx                # Pantalla de acceso
        ├── DashboardPage.jsx            # Vista principal (calendario)
        ├── BookingPage.jsx              # Flujo de reserva paso a paso
        ├── ReservationsPage.jsx         # Mis reservas (historial)
        └── admin/
            ├── AdminDashboardPage.jsx   # Panel administrador
            └── AdminResourcesPage.jsx   # CRUD de recursos
```

---

## Pantallas implementadas

### 1. Login (`/login`)
- Formulario de email + contraseña
- Accesos rápidos de demo (Miembro / Administrador)
- Validación de credenciales contra datos mock
- Redirige al dashboard según rol

**Credenciales demo:**
| Usuario | Email | Contraseña | Rol |
|---------|-------|-----------|-----|
| Valentina López | valentina@kutz.co | 1234 | Miembro |
| Marcos Díaz | marcos@kutz.co | 1234 | Miembro |
| Admin Kutz | admin@kutz.co | admin | Administrador |

---

### 2. Dashboard (`/dashboard`)
- Panel de "mis próximas reservas" con acceso rápido
- Selector de recurso con filtros (Todos / Salas / Escritorios)
- Calendario semanal (Lun–Vie, 08:00–18:00) con disponibilidad en tiempo real
- Botón "Reservar" directo al flujo de booking
- Código de colores:
  - Verde: disponible
  - Rojo: ocupado por otro usuario
  - Azul: mi reserva
  - Gris: bloqueado por admin

---

### 3. Nueva reserva (`/booking`)
Flujo en 2 pasos más confirmación modal:

**Paso 1 — Elegir recurso:**
- Tarjetas con tipo, capacidad, piso, amenidades
- Filtro por tipo (sala/escritorio)
- Selección visual con indicador de check

**Paso 2 — Elegir horario:**
- Calendario semanal del recurso elegido
- Click en slot disponible → selección visual instantánea
- Panel de confirmación del horario seleccionado

**Modal de confirmación:**
- Resumen del recurso, fecha y horario
- Campo opcional para título/motivo
- Animación de carga al confirmar

**Pantalla de éxito:**
- Confirmación visual con checkmark animado
- Nota explicativa del patrón Observer (notificación enviada)
- Acciones: nueva reserva o ver mis reservas

---

### 4. Mis reservas (`/reservations`)
- Listado completo con historial
- Filtros por estado: Todas / Confirmadas / Pendientes / Canceladas
- Acción de cancelar con confirmación inline (previene cancelaciones accidentales)
- Estados visuales diferenciados por color

---

### 5. Panel administrador (`/admin`)
- 4 métricas clave: confirmadas, pendientes, canceladas, bloqueadas
- Calendario semanal con selector de recurso
- Formulario de bloqueo de horarios (fecha, hora inicio, hora fin)
- Feed de actividad reciente
- Tabla completa de todas las reservas con acción de cancelar

---

### 6. Gestión de recursos (`/admin/resources`)
- Grid de todos los recursos (salas y escritorios)
- Información: tipo, capacidad, piso, amenidades, conteo de reservas activas
- CRUD completo:
  - Crear: formulario inline con validación básica
  - Editar: mismo formulario pre-cargado con los datos actuales
  - Eliminar: confirmación inline

---

## Sistema de diseño

### Paleta de colores
| Uso | Color | Tailwind |
|-----|-------|---------|
| Primario / Brand | Azul navy | `brand-900` a `brand-600` |
| Disponible | Verde | `green-100/600` |
| Ocupado / Cancelado | Rojo | `red-100/600` |
| Pendiente | Ambar | `amber-100/700` |
| Bloqueado | Gris | `gray-200/600` |
| Escritorio | Violeta | `violet-100/700` |
| Sala | Azul | `blue-100/700` |

### Tipografía
- System font stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`)
- Sin dependencia de fuentes externas para carga instantánea
- Escala: `text-xs` (12px) a `text-3xl` (30px)

### Espaciado y layout
- Grid base de 4px (Tailwind default)
- Sidebar fija de 256px (`w-64`)
- Contenido principal scrollable (`overflow-y-auto`)
- Cards con `rounded-xl` (12px) y `border border-gray-200`
- Sombras sutiles en hover para elementos interactivos

---

## Decisiones de diseño justificadas

### 1. Sidebar fija vs. navbar horizontal
**Decisión:** sidebar vertical fija.  
**Justificación:** el sistema tiene dos roles con navegaciones distintas (miembro: 3 ítems; admin: 5 ítems). Una sidebar permite mostrar ambas secciones con jerarquía visual clara sin colapsar el contenido. Para una app de gestión de escritorio, la sidebar es el patrón estándar (GitHub, Linear, Notion).

### 2. Calendario semanal como vista principal
**Decisión:** grilla Lun–Vie × 08:00–18:00 como elemento central.  
**Justificación:** reemplaza directamente el flujo actual por WhatsApp. El usuario necesita saber en un vistazo qué está disponible; una lista no lo permite. El calendario semanal es el patrón estándar para calendarios de recursos (Google Calendar, Outlook, Calendly).

### 3. Flujo de booking en pasos explícitos
**Decisión:** paso 1 = recurso, paso 2 = horario, modal = confirmación.  
**Justificación:** reduce errores de selección. Al separar "qué" de "cuándo", el usuario puede evaluar el recurso antes de comprometerse con un horario. El modal de confirmación evita reservas accidentales (principio de confirmación explícita, Nielsen heurística #3).

### 4. Códigos de color en el calendario
**Decisión:** verde (disponible), rojo (ocupado), azul (mío), gris (bloqueado), brand (seleccionado).  
**Justificación:** convención universal en sistemas de calendario. El verde/rojo es preattentive (Gestalt) y reduce la carga cognitiva — el usuario no necesita leer, solo escanear.

### 5. Datos mock en el frontend (sin backend real)
**Decisión:** prototipo funcional con datos hardcodeados en `mockData.js`.  
**Justificación:** el objetivo de la entrega es demostrar los flujos UX/UI y validar la arquitectura de componentes. El backend Python (patrones Observer y Factory) existe como código separado. La integración se realizará en el integrador final mediante una API REST.

### 6. Context API de React vs. Redux
**Decisión:** `useContext` + `useState` para estado global.  
**Justificación:** el estado del prototipo es simple (usuario autenticado + lista de reservas). Redux agrega overhead de configuración innecesario para este scope. Si el proyecto escala con más entidades y efectos asíncronos complejos, se migraría a Redux Toolkit o Zustand.

---

## Relación con los patrones GoF

El diseño frontend refleja los patrones implementados en el backend:

- **Observer (notificaciones):** la pantalla de éxito del booking muestra explícitamente que "el sistema notificó a los observadores registrados", simulando la notificación que el `SistemaReservas` Python envía a `NotificadorEmail` y `ActualizadorCalendario`.

- **Factory Method (creación de recursos):** `ResourceCard` recibe un objeto genérico y renderiza diferente según `resource.type === 'room' | 'desk'`, análogo a cómo `RecursoFactory` produce `Sala` o `Escritorio` según el tipo solicitado.

---

## Cómo ejecutar el prototipo

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` y usá las credenciales demo de la tabla anterior.

---

## Próximos pasos (Integrador)

1. Conectar el frontend con la API REST del backend Python (FastAPI o Flask)
2. Autenticación real con JWT
3. Persistencia de reservas en base de datos
4. Notificaciones reales vía patrón Observer (email o WebSocket)
5. Vista responsiva para mobile
