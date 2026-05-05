# Estrategia de testing - BookDesk

## Objetivo

Validar que las reglas principales del sistema de coworking funcionen correctamente antes de depender de pruebas manuales. La prioridad inicial es cubrir reglas de disponibilidad, reservas y validaciones de horarios.

## Pruebas unitarias

Framework elegido: **Vitest**.

Motivo:

- El proyecto frontend usa Vite.
- La configuracion es simple.
- Permite probar funciones JavaScript puras sin navegador.
- Es gratuito y compatible con GitHub Actions.

Funciones cubiertas inicialmente:

- `isSlotOccupied`
- `getSlotReservation`
- `isValidReservationRange`
- `parseTimeToMinutes`

Tecnicas aplicadas:

- Particion de equivalencia.
- Valores limite.

## Automatizacion CI/CD

El workflow `.github/workflows/test.yml` ejecuta las pruebas unitarias en cada `push` y `pull request`.

Comando ejecutado por CI:

```bash
cd frontend
npm test
```

## Pruebas de integracion futuras

No se implementan en esta entrega, pero se propone probar flujos completos que integren UI, repositorio y servicios externos simulados.

Dependencias externas a aislar:

1. **Supabase Database**
   - Tablas: `resources`, `reservations`, `profiles`.
   - Se mockearia el cliente `supabase.from(...).select/insert/update/delete`.

2. **Supabase Auth**
   - Metodos: `signInWithPassword`, `signUp`, `signOut`.
   - Se stubearian respuestas de usuario miembro y administrador.

Herramienta recomendada:

- **Vitest mocks** para pruebas de integracion livianas.
- **MSW** como mejora futura para interceptar requests HTTP si el sistema crece.

## Flujo conceptual de integracion

```text
Dado un miembro autenticado
Y una sala disponible en el repositorio simulado
Cuando confirma una reserva valida
Entonces se inserta una reserva en Supabase stub
Y el panel muestra la reserva como confirmada
```

```text
Dado un administrador autenticado
Y un recurso existente
Cuando bloquea un horario por mantenimiento
Entonces se crea una reserva marcada como bloqueo
Y ese horario deja de aparecer disponible para miembros
```
