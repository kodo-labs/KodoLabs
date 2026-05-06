# Informe de Usabilidad y Diseño Centrado en el Usuario - BookDesk

## 1. Análisis de Usuario, Tarea y Contexto

### Perfil del Usuario
Los usuarios objetivo de **BookDesk** son principalmente:
* **Profesionales independientes** (freelancers).
* **Nómadas digitales**.
* **Equipos de pequeñas empresas o startups** que requieren flexibilidad espacial.

Estos perfiles se caracterizan por una **alta competencia digital** y una necesidad de **inmediatez**. Buscan optimizar su tiempo y evitar fricciones administrativas al momento de encontrar un lugar de trabajo adecuado para sus tareas del día a día.

### Definición de la Tarea
La tarea principal consiste en la **gestión de reservas de recursos** (escritorios o salas de reuniones). Esto incluye:
1. Exploración de disponibilidad en tiempo real.
2. Comparación de características técnicas del espacio.
3. Confirmación de la reserva.

> **Nota crítica:** Esta actividad es vital, ya que un error en la reserva impacta directamente en la productividad del usuario y en la organización logística del coworking.

### Contexto de Uso
* **Dispositivos:** Operado mayoritariamente a través de computadoras de escritorio o laptops.
* **Entorno:** Oficinas o cafés con conexión a internet estable.
* **Limitación cognitiva:** La atención del usuario puede ser fragmentada.
* **Restricción temporal:** El proceso de reserva debe ser ágil, permitiendo completarse en **menos de dos minutos**.

---

## 2. Auditoría de Usabilidad (ISO 9241-11)

###  Eficacia
* **Métrica:** Tasa de finalización de tareas (porcentaje de usuarios que logran completar una reserva sin errores críticos).
* **Simulación en el prototipo:** Se solicita a un grupo de usuarios reservar el *"Escritorio A1"* para un día específico. Se observa si logran llegar a la pantalla de "Confirmación exitosa" o si abandonan por confusión en la grilla.
* **Mejora propuesta:** Implementar un **resumen flotante lateral** que acompañe al usuario en todo el proceso, mostrando el recurso seleccionado antes del paso final para evitar retrocesos innecesarios.

###  Eficiencia
* **Métrica:** Tiempo promedio para completar una reserva (*Time-on-task*).
* **Simulación en el prototipo:** Medir el tiempo desde el clic inicial en "Reservar" hasta el clic en "Confirmar reserva" en el modal final.
* **Mejora propuesta:** Añadir una función de **"Reserva rápida"** en el panel principal que permita repetir la última reserva (mismo escritorio/horario) con un solo clic.

---

## 3. Alineación con el Ciclo de Diseño (ISO 13407)

El proceso de desarrollo de BookDesk sigue el estándar **ISO 13407** mediante la iteración constante en cuatro etapas clave:

1.  **Entender el contexto de uso:** Definido mediante el análisis previo de usuarios y sus tareas cotidianas.
2.  **Especificar requisitos del usuario:** Identificación de la necesidad de claridad y rapidez en entornos de coworking.
3.  **Producir soluciones de diseño:** Creación de prototipos de alta fidelidad desarrollados en **Stitch**.
4.  **Evaluar los diseños:** Aplicación de auditorías de usabilidad para validar que la solución satisface las necesidades detectadas.

---
*Este documento forma parte del entregable para el Trabajo Práctico Nº2.*
