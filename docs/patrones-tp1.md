# Patrones de Diseño — TP1

**Proyecto:** BookDesk — Sistema de reservas para espacio de coworking  
**Entrega:** TP1  
**Grupo:** KodoLabs  

---

## Índice

1. [Observer (Comportamental)](#patrón-1-observer)
2. [Factory Method (Creacional)](#patrón-2-factory-method)
3. [Diagrama de relaciones](#diagrama-de-relaciones)

---

## Patrón 1: Observer

### Intención

Definir una dependencia uno-a-muchos entre objetos, de modo que cuando uno cambia de estado todos sus dependientes sean notificados y actualizados automáticamente, sin que el sujeto conozca a sus observadores concretos.

### Problema que resuelve en el sistema

Cuando un miembro crea o cancela una reserva, el sistema necesita reaccionar de varias formas simultáneas:

- Enviar una notificación por email al miembro (confirmación o aviso de cancelación)
- Registrar el evento en el panel del administrador para llevar historial

**Sin Observer**, la clase `Reserva` tendría que conocer y llamar directamente a cada canal de notificación:

```python
# ❌ Sin patrón — acoplamiento fuerte
class Reserva:
    def confirmar(self):
        self.estado = "activa"
        NotificadorEmail().enviar(self)      # Reserva conoce Email
        PanelAdmin().registrar_evento(self)  # Reserva conoce Admin
        # Si el día de mañana se agrega SMS o Slack
        # → hay que modificar la clase Reserva ❌
```

Cada nuevo canal de notificación fuerza una modificación en `Reserva`, violando el principio Open/Closed y aumentando el acoplamiento.

### Justificación de la elección

Se eligió **Observer** porque el problema es exactamente para el que fue diseñado: un objeto (`Reserva`) genera eventos de dominio, y múltiples componentes externos deben reaccionar a esos eventos sin que el objeto los conozca.

**¿Por qué Observer y no Strategy?**  
Strategy se usa para variar el *cómo se hace una tarea* (por ejemplo, diferentes algoritmos de ordenamiento). Observer se usa para notificar *que algo pasó*. El problema aquí es de notificación de eventos, no de variación de comportamiento interno.

**¿Por qué Observer y no Mediator?**  
Mediator centraliza la comunicación bidireccional entre múltiples objetos. Observer es más simple y directo para el caso concreto de "un emisor, múltiples receptores pasivos". Agregar Mediator sería sobrediseño para este escenario.

**¿Por qué Observer y no llamadas directas (sin patrón)?**  
Con llamadas directas, `Reserva` queda acoplada a todos los canales. Con Observer, `Reserva` solo conoce la interfaz `ObservadorReserva`. Agregar `NotificadorSMS` no requiere tocar `Reserva` en absoluto.

### Clases involucradas

| Clase | Rol en el patrón | Archivo |
|-------|-----------------|---------|
| `ObservadorReserva` | Observer abstracto (interfaz) | `src/patterns/observer.py` |
| `NotificadorEmail` | Observer concreto | `src/patterns/observer.py` |
| `NotificadorPanelAdmin` | Observer concreto | `src/patterns/observer.py` |
| `Reserva` | Subject (sujeto observable) | `src/domain/reserva.py` |
| `SistemaReservas` | Gestiona la inyección de observers | `src/services/sistema_reservas.py` |

### Relaciones entre clases

```
ObservadorReserva  (abstract)
    ├── NotificadorEmail
    └── NotificadorPanelAdmin

Reserva  (Subject)
    ├── agregar_observador(ObservadorReserva)
    ├── quitar_observador(ObservadorReserva)
    ├── confirmar()  →  _notificar_creacion()
    └── cancelar()   →  _notificar_cancelacion()

SistemaReservas
    └── crea Reserva e inyecta los observers globales
```

### Funcionamiento general

1. `SistemaReservas` tiene una lista de observadores globales (`_observadores_globales`).
2. Al crear una reserva, el sistema inyecta esos observadores en la nueva instancia de `Reserva`.
3. Cuando se llama `reserva.confirmar()`, internamente se ejecuta `_notificar_creacion()`, que itera la lista y llama `on_reserva_creada(self)` en cada observer.
4. Análogamente, `reserva.cancelar()` dispara `_notificar_cancelacion()`.
5. Cada observer decide qué hacer: `NotificadorEmail` imprime/envía el email; `NotificadorPanelAdmin` agrega al log.

### Ejemplo en el código

```python
# src/patterns/observer.py

class ObservadorReserva(ABC):
    @abstractmethod
    def on_reserva_creada(self, reserva: "Reserva") -> None: ...

    @abstractmethod
    def on_reserva_cancelada(self, reserva: "Reserva") -> None: ...


class NotificadorEmail(ObservadorReserva):
    def on_reserva_creada(self, reserva):
        print(f"[EMAIL] Para: {reserva.miembro.email} — Reserva confirmada: {reserva.recurso.nombre}")

    def on_reserva_cancelada(self, reserva):
        print(f"[EMAIL] Para: {reserva.miembro.email} — Reserva cancelada: {reserva.recurso.nombre}")
```

```python
# src/domain/reserva.py — el Subject

class Reserva:
    def __init__(self, ...):
        self._observadores: List[ObservadorReserva] = []   # lista de observers

    def agregar_observador(self, obs: ObservadorReserva) -> None:
        self._observadores.append(obs)

    def confirmar(self) -> None:
        self._notificar_creacion()          # dispara el evento → observers reaccionan

    def cancelar(self) -> None:
        self.estado = EstadoReserva.CANCELADA
        self._notificar_cancelacion()       # dispara el evento → observers reaccionan

    def _notificar_creacion(self) -> None:
        for obs in self._observadores:
            obs.on_reserva_creada(self)     # Reserva NO sabe qué hace cada observer
```

```python
# src/services/sistema_reservas.py — inyección de observers

def crear_reserva(self, recurso, miembro, fecha, hora_inicio, hora_fin):
    reserva = Reserva(...)
    for observador in self._observadores_globales:
        reserva.agregar_observador(observador)   # inyección
    reserva.confirmar()   # dispara notificaciones
    return reserva
```

### Mejora que aporta

| Aspecto | Sin Observer | Con Observer |
|---------|-------------|--------------|
| Acoplamiento | `Reserva` conoce todos los canales | `Reserva` solo conoce `ObservadorReserva` |
| Agregar SMS | Modificar `Reserva` | Crear `NotificadorSMS(ObservadorReserva)` |
| Responsabilidad única | Violada (`Reserva` notifica) | `Reserva` no sabe nada de notificaciones |
| Testabilidad | Difícil (efectos mezclados) | Fácil (se inyectan mocks en test) |

---

## Patrón 2: Factory Method

### Intención

Definir una interfaz para crear un objeto, pero dejar que las subclases decidan qué clase concreta instanciar. Permite que una clase delegue la instanciación a sus subclases, evitando el acoplamiento entre el cliente y las clases concretas.

### Problema que resuelve en el sistema

El sistema gestiona dos tipos de recursos reservables: `Sala` y `Escritorio`. Cada uno tiene parámetros de construcción distintos:
- `Sala` necesita: `capacidad`, `tiene_proyector`
- `Escritorio` necesita: `numero`, `zona`

**Sin Factory Method**, el código que gestiona recursos quedaría acoplado a las clases concretas y lleno de condicionales:

```python
# ❌ Sin patrón — cliente acoplado a clases concretas
def crear_recurso(tipo, id, nombre, **kwargs):
    if tipo == "sala":
        return Sala(id, nombre, kwargs["capacidad"], kwargs["tiene_proyector"])
    elif tipo == "escritorio":
        return Escritorio(id, nombre, kwargs["numero"], kwargs["zona"])
    # Si se agrega CabinaFono → hay que modificar esta función ❌
```

El problema escala: si el admin puede agregar nuevos tipos de recursos, cada nuevo tipo fuerza una modificación en el código cliente.

### Justificación de la elección

Se eligió **Factory Method** porque el problema central es la creación de objetos de una jerarquía (`Recurso`) con variantes concretas, y porque se requiere que el sistema pueda extenderse con nuevos tipos sin modificar el código existente.

**¿Por qué Factory Method y no Abstract Factory?**  
Abstract Factory está pensado para familias de objetos relacionados que deben usarse juntos (por ejemplo, botones + campos de texto + ventanas en un mismo estilo visual). En este sistema hay una sola jerarquía (`Recurso`) con variantes, no familias cruzadas. Factory Method es la elección más simple y correcta.

**¿Por qué Factory Method y no Builder?**  
Builder es apropiado cuando la construcción de un objeto requiere muchos pasos secuenciales y opcionales (un "telescoping constructor"). Crear una `Sala` o un `Escritorio` es una operación directa con pocos parámetros. Builder sería sobrediseño aquí.

**¿Por qué Factory Method y no instanciación directa?**  
Con instanciación directa (`Sala(id, nombre, cap, proy)`), el cliente queda acoplado a la clase concreta. Con Factory Method, el cliente trabaja contra `RecursoFactory` y puede cambiar el tipo de factory sin cambiar el resto del código.

### Clases involucradas

| Clase | Rol en el patrón | Archivo |
|-------|-----------------|---------|
| `RecursoFactory` | Creator abstracto (define el Factory Method) | `src/patterns/factory.py` |
| `SalaFactory` | Creator concreto | `src/patterns/factory.py` |
| `EscritorioFactory` | Creator concreto | `src/patterns/factory.py` |
| `Recurso` | Producto abstracto | `src/domain/recurso.py` |
| `Sala` | Producto concreto | `src/domain/sala.py` |
| `Escritorio` | Producto concreto | `src/domain/escritorio.py` |

### Relaciones entre clases

```
RecursoFactory  (abstract Creator)
    │  crear_recurso() → Recurso   ← Factory Method
    ├── SalaFactory
    │       └── crear_recurso() → Sala
    └── EscritorioFactory
            └── crear_recurso() → Escritorio

Recurso  (abstract Product)
    ├── Sala
    └── Escritorio
```

### Funcionamiento general

1. El cliente (o el admin en `main.py`) instancia una factory concreta (`SalaFactory` o `EscritorioFactory`).
2. Llama a `crear_recurso()` con los parámetros del tipo correspondiente.
3. La factory construye el objeto concreto (`Sala` o `Escritorio`) y lo devuelve como `Recurso`.
4. El cliente recibe un `Recurso` y lo agrega al sistema sin conocer la clase concreta.
5. Para agregar un nuevo tipo (`CabinaFono`): se crea la clase y su factory, sin tocar nada existente.

### Ejemplo en el código

```python
# src/patterns/factory.py

class RecursoFactory(ABC):
    @abstractmethod
    def crear_recurso(self, id: str, nombre: str, **kwargs) -> Recurso:
        pass   # Factory Method — las subclases deciden qué instanciar


class SalaFactory(RecursoFactory):
    def crear_recurso(self, id: str, nombre: str, capacidad: int = 10,
                      tiene_proyector: bool = False) -> Sala:
        sala = Sala(id, nombre, capacidad, tiene_proyector)
        print(f"[FACTORY] Sala creada: {sala.descripcion()}")
        return sala


class EscritorioFactory(RecursoFactory):
    def crear_recurso(self, id: str, nombre: str, numero: int = 1,
                      zona: str = "General") -> Escritorio:
        escritorio = Escritorio(id, nombre, numero, zona)
        print(f"[FACTORY] Escritorio creado: {escritorio.descripcion()}")
        return escritorio
```

```python
# src/main.py — uso del Factory Method (cliente desacoplado)

sala_factory      = SalaFactory()
escritorio_factory = EscritorioFactory()

# El cliente no instancia Sala() ni Escritorio() directamente
sala1       = sala_factory.crear_recurso("S01", "Sala Innovación", capacidad=8, tiene_proyector=True)
escritorio1 = escritorio_factory.crear_recurso("E01", "Escritorio Norte", numero=1, zona="Silencio")

sistema.registrar_recurso(sala1)
sistema.registrar_recurso(escritorio1)
```

### Mejora que aporta

| Aspecto | Sin Factory Method | Con Factory Method |
|---------|-------------------|-------------------|
| Acoplamiento | Cliente conoce `Sala`, `Escritorio` | Cliente conoce `RecursoFactory` |
| Agregar `CabinaFono` | Modificar bloque `if/elif` del cliente | Crear `CabinaFono` + `CabinaFonoFactory` |
| Encapsulamiento | Lógica de construcción dispersa | Centralizada en cada factory |
| Open/Closed | Violado (modificar existente) | Respetado (solo agregar nuevo) |

---

## Diagrama de relaciones

```
┌─────────────────────────────────────────────────────┐
│                   DOMINIO                           │
│                                                     │
│   Recurso (abstract)                                │
│     ├── Sala                                        │
│     └── Escritorio                                  │
│                                                     │
│   Reserva  ──────────────── ObservadorReserva       │
│   (Subject)  1 ─── * (list)   (Observer interfaz)  │
│     ├── confirmar()           ├── NotificadorEmail  │
│     └── cancelar()            └── NotificadorPanelAdmin
│                                                     │
│   Usuario                                           │
│     ├── Miembro                                     │
│     └── Administrador                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   PATRONES                          │
│                                                     │
│   RecursoFactory (abstract)    ← Factory Method     │
│     ├── SalaFactory                                 │
│     └── EscritorioFactory                          │
│                                                     │
│   ObservadorReserva (abstract) ← Observer           │
│     ├── NotificadorEmail                            │
│     └── NotificadorPanelAdmin                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   SERVICIO                          │
│                                                     │
│   SistemaReservas                                   │
│     ├── crear_reserva()   → usa Reserva + Observer  │
│     ├── cancelar_reserva()                          │
│     └── ver_disponibilidad()                        │
└─────────────────────────────────────────────────────┘
```
