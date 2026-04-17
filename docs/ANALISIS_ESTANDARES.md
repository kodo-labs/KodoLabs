# Análisis de Estándares Normativos - Sistema de Coworking

## Tabla Comparativa de Estándares

| Estándar | Enfoque Principal | ¿Aplica al Proyecto? | Justificación |
| :--- | :--- | :--- | :--- |
| **ISO 9241-11** | Usabilidad (Eficacia, Eficiencia, Satisfacción). | **Sí** | Es vital que los miembros puedan reservar espacios sin fricciones ni errores de interfaz. |
| **ISO 13407** | Diseño Centrado en el Humano (HCD). | **Sí** | Define el proceso de desarrollo mediante la comprensión del contexto de uso de los "coworkers". |
| **ISO/IEC 27001** | Gestión de Seguridad de la Información (SGSI). | **Sí** | Protege la privacidad de los usuarios, sus credenciales de acceso y datos financieros. |
| **ISA/IEC 62443** | Ciberseguridad en Control Industrial. | **Parcial** | Solo si el sistema interactúa directamente con la infraestructura del edificio (IoT, HVAC, Energía). |
| **ISO 9001** | Gestión de la Calidad y mejora continua. | **Sí** | Asegura que el software se desarrolla bajo procesos estandarizados que garantizan un producto final confiable. |

## Conclusión y Certificación

Si tuviéramos que certificar nuestro sistema bajo un estándar actual, elegiríamos **ISO/IEC 27001**. Dado que gestionamos datos de terceros y accesos físicos, la seguridad es la prioridad absoluta.

En cuanto al diseño, esto implicaría pasar de un enfoque centrado solo en la funcionalidad a uno de **"Seguridad por Diseño"**. El análisis de nuestras decisiones en el TP1 arroja lo siguiente:

* **Patrón Observer:** Nos facilita el cumplimiento de la norma, ya que permite gatillar sistemas de auditoría y logs de forma automática ante cambios de estado sensibles sin acoplar la lógica de negocio.
* **Patrón Factory:** Ayuda a la estandarización de procesos (ISO 9001) al asegurar que la creación de objetos complejos (como diferentes niveles de membresía) sea consistente y libre de errores manuales.
