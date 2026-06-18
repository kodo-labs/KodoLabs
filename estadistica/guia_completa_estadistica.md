# Guía completa del módulo de Análisis Estadístico de BookDesk

## Contexto del proyecto

BookDesk es un sistema de reservas para un coworking desarrollado como proyecto integrador para las materias Probabilidad y Estadística, Análisis Numérico e Ingeniería de Software II de la carrera Ingeniería en Sistemas de Información de la Universidad de la Cuenca del Plata.

El sistema permite a los usuarios reservar salas de reuniones y escritorios individuales. Las reservas se hacen en bloques de 15 minutos (mínimo 0.5 horas, máximo 8 horas). El módulo de estadística analiza los patrones de uso del coworking para ayudar al administrador a tomar decisiones basadas en datos.

El módulo está disponible en la ruta /estadistica de la aplicación web desplegada en Vercel.

La aplicación fue desarrollada con React 18, Vite, Tailwind CSS y Recharts para los gráficos. El backend usa Supabase (PostgreSQL).

---

## Generación de los datos

Los datos se generan de forma simulada pero reproducible usando un generador de números pseudoaleatorios con semilla fija (seed = 42). Esto significa que cada vez que se carga la página, los datos son exactamente los mismos. La fórmula del generador es un generador congruencial lineal: s = (s × 16807) mod 2147483647, y el valor aleatorio se obtiene como (s - 1) / 2147483646.

Para generar datos con distribución normal se usa la transformada de Box-Muller: z = sqrt(-2 × ln(u1)) × cos(2π × u2), donde u1 y u2 son valores uniformes del generador.

Se generan 50 reservas con 4 configuraciones diferentes:
- 20 reservas de Sala de Reuniones con media 2.0 horas y desvío 0.6
- 15 reservas de Escritorio con media 4.0 horas y desvío 1.0
- 10 reservas de Escritorio con media 6.5 horas y desvío 0.8
- 5 reservas de Sala de Reuniones con media 1.5 horas y desvío 0.3

Cada duración se acota al rango [0.5, 8.0] horas y se redondea al múltiplo de 0.25 más cercano (Math.round(d × 4) / 4) para que sea coherente con el sistema de reservas real que permite reservar en bloques de 15 minutos.

El resultado son 25 reservas de Sala de Reuniones y 25 de Escritorio.

Además se generan datos para 30 días de operación del coworking, con dos variables por día: cantidad de usuarios activos (x) y cantidad de reservas realizadas (y). Los usuarios se generan con una distribución uniforme entre 5 y 35, y las reservas siguen una relación lineal con ruido: r = 0.6 × usuarios + ruido_normal(0, 2) + 3.

---

## Sección 1: Resumen General

Son 4 tarjetas con los indicadores principales:

- Reservas analizadas: 50 (tamaño de la muestra)
- Duración promedio: 3.5 h (media aritmética)
- Reserva más corta: 0.5 h (valor mínimo)
- Reserva más larga: 8.0 h (valor máximo)

El tamaño de muestra n = 50 se eligió porque supera el umbral de 30 que exige el Teorema Central del Límite. Con n mayor a 30, la distribución de la media muestral se aproxima a una distribución normal sin importar la distribución original de los datos. Esto nos habilita a usar la distribución t de Student para construir intervalos de confianza y hacer pruebas de hipótesis.

Debajo de estas cards hay un desplegable que muestra los 50 datos crudos: número de reserva, tipo de recurso (Sala de Reuniones o Escritorio) y duración en horas. Al final del desplegable se listan los 50 valores ordenados de menor a mayor.

---

## Sección 2: ¿Cuánto duran las reservas? (Distribución de duraciones)

Esta sección tiene dos gráficos: un histograma y un gráfico de torta (pie chart).

### Histograma

El histograma agrupa las 50 duraciones en clases (intervalos) y muestra cuántas reservas caen en cada intervalo. Es la forma estándar de visualizar la distribución de una variable cuantitativa continua.

Para construirlo se sigue este procedimiento:

Paso 1 — Determinar la cantidad de clases usando la Regla de Sturges:
k = 1 + 3.322 × log10(n)
k = 1 + 3.322 × log10(50)
k = 1 + 3.322 × 1.6990
k = 6.64
Redondeando hacia arriba: k = 7 clases

Paso 2 — Calcular el rango y la amplitud:
Rango = Valor máximo - Valor mínimo = 8.00 - 0.50 = 7.50
Amplitud = Rango / k = 7.50 / 7 = 1.07, que se redondea a 1.1

Paso 3 — Construir la tabla de frecuencias partiendo desde 0.5:

| Clase | Intervalo | Frecuencia absoluta (fi) |
|-------|-----------|--------------------------|
| 1 | [0.5 - 1.6) | 7 |
| 2 | [1.6 - 2.7) | 17 |
| 3 | [2.7 - 3.8) | 8 |
| 4 | [3.8 - 4.9) | 5 |
| 5 | [4.9 - 6.0) | 4 |
| 6 | [6.0 - 7.1) | 7 |
| 7 | [7.1 - 8.2] | 2 |
| Total | | 50 |

Los intervalos son cerrados a la izquierda y abiertos a la derecha [li, ls), excepto el último que incluye el valor máximo.

Interpretación del histograma:
La clase con mayor frecuencia es [1.6 - 2.7) con 17 reservas. Esto corresponde a reuniones cortas en salas de reuniones. La distribución es asimétrica positiva (sesgada a la derecha): hay una concentración de reservas cortas y una cola hacia la derecha con reservas largas (jornadas completas en escritorios). Se observa un segundo pico en la clase [6.0 - 7.1) con 7 reservas, que corresponde a jornadas completas de trabajo en escritorios.

### Gráfico de torta (Pie Chart)

Muestra la distribución por tipo de recurso:
- Salas de Reuniones: 25 reservas (50%)
- Escritorios: 25 reservas (50%)

El uso está balanceado entre ambos tipos de recurso. Esto es coherente con la configuración de los datos: 20 + 5 = 25 reservas de sala, y 15 + 10 = 25 reservas de escritorio.

---

## Sección 3: Métricas clave de duración (Estadística descriptiva)

Esta sección presenta 4 indicadores resumidos y luego un desarrollo paso a paso con todos los cálculos.

### Media aritmética (Promedio)

Fórmula: x̄ = Σxi / n

Se suman todas las duraciones:
Σxi = 175.00

Se divide por el total:
x̄ = 175.00 / 50 = 3.5000 horas

La media es el centro de gravedad de los datos. Cada reserva contribuye proporcionalmente al promedio.

### Mediana (Valor central)

Se ordenan los 50 datos de menor a mayor. Como n = 50 es par, la mediana es el promedio de los valores en las posiciones 25 y 26.

Me = (x(25) + x(26)) / 2 = 3.00 horas

La mediana es 3.00, que es menor que la media (3.50). Esto indica que la distribución está sesgada a la derecha: hay reservas largas (jornadas completas en escritorios) que elevan el promedio por encima del valor central. La mediana es más robusta que la media frente a valores extremos.

### Moda (Valor más frecuente)

La moda es el valor que más se repite en los datos. El valor 2.0 horas es el que tiene mayor frecuencia absoluta. Tiene sentido porque las reuniones de 2 horas son las más comunes en un coworking (la configuración principal genera 20 reservas con media 2.0).

### Varianza y Desvío estándar

Se usa la corrección de Bessel (dividir por n-1 en lugar de n) porque estamos trabajando con una muestra, no con la población completa. Dividir por n-1 da una estimación insesgada de la varianza poblacional.

Fórmula de la varianza muestral:
S² = Σ(xi - x̄)² / (n - 1)

Se calcula la suma de los desvíos cuadrados respecto a la media y se divide por n - 1 = 49.

S² = 3.8597

Desvío estándar:
S = √S² = √3.8597 = 1.9646 horas

El desvío estándar indica que las duraciones se dispersan en promedio 1.96 horas respecto al promedio de 3.50 horas.

### Coeficiente de Variación (CV)

Fórmula: CV = (S / x̄) × 100

CV = (1.9646 / 3.5000) × 100 = 56.13%

Un CV mayor a 30% indica alta dispersión. En nuestro caso el CV es 56%, lo cual es esperable porque tenemos dos tipos de uso muy diferentes: reuniones cortas en salas (1-3 horas) y jornadas completas en escritorios (5-8 horas). Si todos los usuarios usaran el coworking de la misma manera, el CV sería más bajo.

### Cuartiles

Q1 (percentil 25) = 2.00 horas — El 25% de las reservas dura menos de 2 horas.
Q3 (percentil 75) = 5.25 horas — El 75% de las reservas dura menos de 5.25 horas.

Rango intercuartil:
IQR = Q3 - Q1 = 5.25 - 2.00 = 3.25 horas

El IQR indica que el 50% central de los datos se concentra en un rango de 3.25 horas (entre 2.00 y 5.25 horas). Es una medida de dispersión más robusta que el rango porque no se ve afectada por valores extremos.

### Resumen de todas las medidas descriptivas

| Medida | Valor |
|--------|-------|
| n (tamaño de muestra) | 50 |
| Suma total | 175.00 h |
| Media (x̄) | 3.5000 h |
| Mediana (Me) | 3.00 h |
| Moda (Mo) | 2.0 h |
| Varianza (S²) | 3.8597 |
| Desvío estándar (S) | 1.9646 h |
| Coeficiente de variación (CV) | 56.13% |
| Mínimo | 0.50 h |
| Máximo | 8.00 h |
| Rango | 7.50 h |
| Q1 | 2.00 h |
| Q3 | 5.25 h |
| IQR | 3.25 h |

---

## Sección 4: ¿Más usuarios = más reservas? (Regresión lineal y correlación)

Esta sección usa un conjunto de datos diferente: 30 días de operación del coworking, donde para cada día se registra la cantidad de usuarios activos (variable x) y la cantidad de reservas realizadas (variable y).

Los 30 datos se eligieron porque 30 es el mínimo clásico para que los resultados de regresión lineal y el coeficiente de Pearson tengan validez estadística.

### Diagrama de dispersión

El gráfico principal muestra solo los puntos azules (datos reales). Cada punto es un día: la posición horizontal indica cuántos usuarios se conectaron ese día, y la posición vertical indica cuántas reservas se hicieron.

Se observa una tendencia claramente ascendente: los días con más usuarios tienen más reservas. Esto sugiere una correlación positiva.

Nota: hay 30 puntos en total pero se ven 26 porque hay 4 pares de puntos con coordenadas idénticas que se superponen visualmente. Los pares superpuestos son: (15, 10), (16, 10), (19, 15) y (33, 24).

### Cálculo de la recta de regresión por mínimos cuadrados

Se usa el método de mínimos cuadrados para ajustar una recta y = mx + b que minimice la suma de los errores cuadrados entre los valores reales y los valores estimados por la recta.

Paso 1 — Tabla de sumatorias (n = 30 días):

| Sumatoria | Valor |
|-----------|-------|
| Σxi | 523 |
| Σyi | 400 |
| Σxi·yi | 8275 |
| Σxi² | 10995 |
| Σyi² | 6302 |

Medias:
x̄ = Σxi / n = 523 / 30 = 17.4333
ȳ = Σyi / n = 400 / 30 = 13.3333

Paso 2 — Cálculo de la pendiente (m):

Fórmula: m = (Σxi·yi - n · x̄ · ȳ) / (Σxi² - n · x̄²)

Numerador (covarianza):
Σxi·yi - n · x̄ · ȳ = 8275 - 30 × 17.4333 × 13.3333 = 1301.6667

Denominador (varianza de x):
Σxi² - n · x̄² = 10995 - 30 × 17.4333² = 1877.3667

m = 1301.6667 / 1877.3667 = 0.6934

La pendiente de 0.6934 significa que por cada usuario activo adicional que se conecta al sistema, se esperan aproximadamente 0.69 reservas más ese día.

Paso 3 — Cálculo de la ordenada al origen (b):

Fórmula: b = ȳ - m · x̄

b = 13.3333 - 0.6934 × 17.4333 = 1.2459

La ordenada al origen de 1.2459 representa un nivel base de reservas que se generan independientemente de la cantidad de usuarios (por ejemplo, reservas programadas con anticipación).

Ecuación del modelo: ŷ = 0.6934x + 1.2459

Paso 4 — Coeficiente de correlación de Pearson (r):

Fórmula: r = (Σxi·yi - n · x̄ · ȳ) / √[(Σxi² - n · x̄²) · (Σyi² - n · ȳ²)]

Numerador = 1301.6667

Denominador:
Σyi² - n · ȳ² = 6302 - 30 × 13.3333² = 968.6933
√(1877.3667 × 968.6933) = √1818028.6 = 1348.5646

r = 1301.6667 / 1348.5646 = 0.9652

El coeficiente de Pearson r va de -1 a 1. Un valor de 0.9652 indica una correlación positiva muy fuerte. Los valores están muy cerca de la recta.

Paso 5 — Coeficiente de determinación (r²):

r² = 0.9652² = 0.9317

El r² de 0.9317 significa que el 93.17% de la variabilidad en las reservas queda explicada por la cantidad de usuarios activos. Solo el 6.83% se debe a otros factores no medidos.

En el desplegable "Ver desarrollo paso a paso" se muestra un segundo gráfico que superpone la recta de regresión (línea roja) sobre los puntos del diagrama de dispersión, para visualizar el ajuste del modelo.

### Cards de resumen:
- Correlación: 97% (relación fuerte y positiva)
- Precisión del modelo: 93% (de la variación queda explicada)
- Por cada usuario más: +0.7 reservas (impacto estimado por día)

---

## Sección 5: Predicción de reservas por interpolación (Análisis Numérico)

Esta sección conecta con la materia Análisis Numérico. Se usa la recta de regresión como función de interpolación para estimar valores de reservas para cantidades de usuarios que no están en los datos originales.

### ¿Qué es la interpolación?

Interpolación es estimar valores intermedios dentro del rango de datos observados. Se diferencia de la extrapolación, que estima valores fuera del rango observado y es menos confiable.

En nuestro caso, los datos van de 5 a 33 usuarios. Cualquier estimación para un valor de x entre 5 y 33 que no esté en los datos originales es interpolación. Si estimáramos para x = 50, sería extrapolación.

### ¿Por qué usar mínimos cuadrados como método de interpolación?

Mínimos cuadrados es un método numérico de ajuste de curvas. A diferencia de métodos como Lagrange o Newton, que generan un polinomio que pasa exactamente por cada punto de datos, mínimos cuadrados busca la función que mejor se aproxima al conjunto de datos minimizando la suma de los errores cuadrados. Es más adecuado cuando los datos tienen ruido o variabilidad natural, como en nuestro caso (no todos los días con la misma cantidad de usuarios tienen la misma cantidad de reservas).

### Modelo utilizado

ŷ = 0.6934x + 1.2459

Donde x es la cantidad de usuarios activos y ŷ es la estimación de reservas.

### Puntos interpolados

El sistema selecciona automáticamente 3 valores de x que no aparecen en los datos originales (valores enteros de usuarios que no se registraron en ningún día) y calcula el valor estimado de y para cada uno.

Para cada punto, el cálculo es simplemente reemplazar x en la ecuación:

Ejemplo con x = 10 usuarios:
ŷ = 0.6934 × 10 + 1.2459 = 6.934 + 1.2459 = 8.18 reservas

Ejemplo con x = 25 usuarios:
ŷ = 0.6934 × 25 + 1.2459 = 17.335 + 1.2459 = 18.58 reservas

Estos valores no existen en los datos originales — son puntos hallados mediante interpolación.

### Validez de la interpolación

Los puntos interpolados se encuentran dentro del rango de datos observados (5 a 33 usuarios), por lo tanto la estimación es confiable. Si se quisiera estimar para valores fuera de ese rango (por ejemplo, 50 usuarios), ya no sería interpolación sino extrapolación, que tiene menor precisión porque no sabemos si la relación lineal se mantiene fuera del rango observado.

### Aplicación práctica

La interpolación permite al administrador del coworking estimar la demanda en escenarios que no ocurrieron en el período analizado. Por ejemplo, si un día se conectan 10 usuarios, el sistema puede anticipar aproximadamente 8 reservas. Esto facilita la planificación de recursos.

---

## Sección 6: Intervalo de Confianza (IC al 95%)

Esta sección pasa de la estadística descriptiva a la estadística inferencial. Mientras que las secciones anteriores describían la muestra de 50 reservas, ahora queremos inferir algo sobre toda la población de reservas del coworking.

### ¿Qué es un intervalo de confianza?

Es un rango de valores dentro del cual estimamos que se encuentra el verdadero valor del parámetro poblacional (en este caso, la media de duración de todas las reservas). No conocemos la media real porque no podemos medir todas las reservas que se harán en el coworking, pero con la muestra podemos dar una estimación con un nivel de confianza.

### Cards de resumen:
- Mínimo estimado: 2.94 h (límite inferior del IC)
- Promedio observado: 3.50 h (mejor estimación puntual)
- Máximo estimado: 4.06 h (límite superior del IC)

### Barra visual

Es una representación gráfica del intervalo. El punto azul central es la media muestral (3.50h) y la barra celeste representa el rango del intervalo (2.94 a 4.06).

### Desarrollo paso a paso

Paso 1 — Datos:
- x̄ = 3.5000 (media muestral, calculada en la sección 3)
- S = 1.9646 (desvío estándar muestral, calculado en la sección 3)
- n = 50 (tamaño de la muestra)
- Nivel de confianza: 1 - α = 0.95, entonces α = 0.05

Paso 2 — Elección de la distribución:
Como el desvío poblacional σ es desconocido y se estima con el desvío muestral S, usamos la distribución t de Student en lugar de la distribución normal Z. Los grados de libertad son gl = n - 1 = 50 - 1 = 49. Nota: si conociéramos σ, usaríamos Z. A medida que n crece, la distribución t se aproxima a la normal.

Paso 3 — Valor crítico:
Dividimos α en dos porque el intervalo tiene dos lados: α/2 = 0.05/2 = 0.025.
Buscamos en la tabla de t de Student con gl = 49 y α/2 = 0.025:
t(α/2) = 2.0096

Paso 4 — Error estándar de la media:
EE = S / √n
EE = 1.9646 / √50
EE = 1.9646 / 7.0711
EE = 0.2778

El error estándar mide qué tan precisa es nuestra media muestral como estimación de la media poblacional. Cuantos más datos tengamos (n más grande), más chico es el error estándar y más precisa es la estimación.

Paso 5 — Margen de error:
E = t(α/2) × EE
E = 2.0096 × 0.2778
E = 0.5583

El margen de error es lo que le sumamos y restamos a la media muestral para construir el intervalo.

Paso 6 — Intervalo de confianza:
IC = (x̄ - E ; x̄ + E)
IC = (3.5000 - 0.5583 ; 3.5000 + 0.5583)
IC = (2.9417 ; 4.0583)
Redondeado: IC = (2.94 ; 4.06)

### Interpretación del 95% de confianza

El 95% de confianza NO significa que hay un 95% de probabilidad de que la media real esté entre 2.94 y 4.06. Lo que significa es: si repitiéramos el proceso completo 100 veces (tomar una muestra de 50 reservas, calcular la media, construir el IC), en 95 de esas 100 veces el intervalo calculado contendría la media real. Es una medida de la confiabilidad del método, no del resultado puntual.

---

## Sección 7: Prueba de Hipótesis

La prueba de hipótesis responde una pregunta concreta: ¿la duración promedio real es 3 horas, o es diferente?

### ¿Qué es una prueba de hipótesis?

Es un procedimiento estadístico para tomar una decisión sobre un parámetro poblacional basándose en datos muestrales. Se plantean dos hipótesis contrapuestas y se usa un estadístico calculado con los datos para decidir cuál se mantiene.

### Las dos hipótesis

Suposición inicial (H₀ - hipótesis nula): μ = 3
La duración promedio real de las reservas es de 3 horas. Esta es la hipótesis que ponemos a prueba. Se asume verdadera hasta que los datos la contradigan.

Alternativa (Hₐ - hipótesis alternativa): μ ≠ 3
La duración promedio real es diferente de 3 horas. Se acepta solo si los datos muestran una diferencia estadísticamente significativa.

Es una prueba bilateral (de dos colas) porque nos importa si el promedio es diferente en cualquier dirección, tanto mayor como menor que 3.

### Desarrollo paso a paso

Paso 1 — Datos:
- μ₀ = 3 (el valor supuesto que queremos probar)
- S = 1.9646 (desvío estándar muestral)
- n = 50
- α = 0.05 (nivel de significancia: aceptamos un 5% de probabilidad de rechazar H₀ siendo verdadera)

Paso 2 — Hipótesis:
- H₀: μ = 3
- Hₐ: μ ≠ 3
- Prueba bilateral (dos colas)

Paso 3 — Distribución muestral:
Como σ es desconocido y se estima con S, usamos la distribución t de Student.
X̄ ~ t(gl = n - 1) = t(49)

Paso 4 — Valor crítico:
α/2 = 0.05/2 = 0.025
gl = n - 1 = 50 - 1 = 49
Buscando en la tabla t de Student con gl = 49 y α/2 = 0.025:
tc = ±2.0096

Esto define las zonas de decisión:
- Zona de rechazo: tp > 2.0096 o tp < -2.0096
- Zona de no rechazo: -2.0096 < tp < 2.0096

Paso 5 — Fórmula del estadístico de prueba:
tp = (X̄ - μ₀) / (S / √n)

Esta fórmula mide qué tan lejos está el promedio observado del valor supuesto, expresado en unidades de error estándar. Si tp es grande (positivo o negativo), significa que la diferencia es probablemente real. Si tp es chico, la diferencia podría deberse al azar.

Paso 6 — Regla de decisión:
Si |tp| ≥ tc → Rechazamos H₀ (la diferencia es significativa)
Si |tp| < tc → No rechazamos H₀ (la diferencia no es significativa)

Concretamente: si tp ≥ 2.0096 o tp ≤ -2.0096, rechazamos H₀.

Paso 7 — Cálculo del estadístico (estandarización):
X̄ = 3.5000

tp = (3.5000 - 3) / (1.9646 / √50)
tp = 0.5000 / 0.2778
tp = 1.7996

¿Qué significa tp = 1.7996? Que el promedio observado (3.50h) está a 1.80 errores estándar del valor supuesto (3.00h). No es lo suficientemente lejos como para ser sospechoso al nivel de confianza del 95%.

Paso 8 — Decisión:
|tp| = |1.7996| = 1.7996
tc = 2.0096
1.7996 < 2.0096 → No rechazamos H₀

Paso 9 — Conclusión:
Con la evidencia de los datos muestrales, no podemos concluir que la duración promedio de las reservas del coworking sea diferente de 3 horas. Se mantiene la suposición de que el promedio es 3h.

### Barra visual de la prueba

La barra en la pantalla muestra:
- Zonas rojas en los extremos: zonas de rechazo (más allá de ±2.0096)
- Zona verde en el centro: zona de no rechazo (entre -2.0096 y +2.0096)
- Punto azul: la posición de nuestro estadístico tp = 1.7996
- Líneas rojas verticales: los valores críticos ±2.0096

El punto azul está en la zona verde, lo que confirma visualmente que no rechazamos H₀.

### ¿Por qué no se rechaza si el promedio muestral es 3.50?

Porque la variabilidad de los datos es alta (CV = 56%). Con tanta dispersión, una diferencia de 0.50 horas entre el promedio observado y el valor supuesto puede deberse simplemente al azar del muestreo. Si la variabilidad fuera más baja (por ejemplo, CV = 15%), o si tuviéramos muchos más datos (por ejemplo, n = 200), la misma diferencia de 0.50 horas probablemente sí sería significativa.

### Implicancia para BookDesk

No hay evidencia estadística de que el uso real del coworking se aleje de las 3 horas promedio. Los slots de tiempo del sistema están bien calibrados y son coherentes con el comportamiento de los usuarios.

---

## Sección 8: Recomendaciones para BookDesk

Son conclusiones prácticas que conectan el análisis estadístico con decisiones de ingeniería de software:

1. Slots de tiempo flexibles: Como el 50% de las reservas dura entre 2.0h (Q1) y 5.25h (Q3), conviene ofrecer opciones predeterminadas de 1h, 2h y 4h para agilizar el proceso de reserva.

2. Anticipar días de alta demanda: Usando el modelo de regresión, cuando hay más de 25 usuarios activos se esperan más de 18 reservas. El sistema puede alertar al administrador para habilitar recursos extra.

3. Sugerencias automáticas de duración: Para salas de reuniones sugerir 2.0h (la moda). Para escritorios sugerir jornada parcial o completa según el historial del usuario.

4. Monitoreo continuo: Si el promedio de duración sale del rango del intervalo de confianza (2.94h - 4.06h), puede indicar un cambio en los patrones de uso que requiere atención del administrador.

---

## Relación entre las tres materias

### Probabilidad y Estadística
Abarca la estadística descriptiva (media, mediana, moda, varianza, desvío, CV, cuartiles, histograma), la regresión lineal con correlación de Pearson, el intervalo de confianza al 95% con t de Student, y la prueba de hipótesis bilateral.

### Análisis Numérico
Se aplica en el ajuste de la recta por mínimos cuadrados (método numérico de aproximación de funciones) y en la interpolación lineal usando la recta obtenida para estimar valores no observados dentro del rango de datos.

### Ingeniería de Software II
Se refleja en el desarrollo del sistema completo: arquitectura React con componentes reutilizables, generación reproducible de datos con semilla fija, visualización interactiva con Recharts, despliegue continuo con Vercel, y la integración del análisis estadístico como módulo funcional del sistema que aporta valor al administrador del coworking.

---

## Valores numéricos exactos para verificación

Estadística descriptiva:
- n = 50, Σxi = 175.00, x̄ = 3.5000, Me = 3.00, Mo = 2.0
- S² = 3.8597, S = 1.9646, CV = 56.13%
- Min = 0.50, Max = 8.00, Rango = 7.50, Q1 = 2.00, Q3 = 5.25

Histograma:
- k = 7 clases, Amplitud = 1.1
- Frecuencias: 7, 17, 8, 5, 4, 7, 2

Regresión (30 días):
- ΣX = 523, ΣY = 400, ΣXY = 8275, ΣX² = 10995, ΣY² = 6302
- x̄ = 17.4333, ȳ = 13.3333
- m = 0.6934, b = 1.2459
- r = 0.9652, r² = 0.9317

Intervalo de confianza:
- EE = 0.2778, E = 0.5583
- t(0.025, 49) = 2.0096
- IC = (2.94 ; 4.06)

Prueba de hipótesis:
- H₀: μ = 3, Hₐ: μ ≠ 3
- tp = 1.7996, tc = ±2.0096
- Decisión: No rechazar H₀
