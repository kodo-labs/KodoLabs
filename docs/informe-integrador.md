# Informe integrador - BookDesk

## 1. Mejora elegida y problema resuelto

La mejora se denomina **Asistencia y Comunicacion Inteligente**. Resuelve tres
problemas del sistema original: una reserva no tenia confirmacion externa, el
usuario debia recorrer pantallas para resolver dudas simples y el administrador
no contaba con una salida util para analizar el uso del coworking.

La solucion integra emails transaccionales con Resend, un asistente contextual
con Claude y reportes exportables. Las claves privadas permanecen en funciones
de Vercel y cada solicitud valida el JWT de Supabase. La operacion principal se
guarda antes del email, por lo que una falla del proveedor no elimina una
reserva ni una cancelacion.

## 2. Implementacion de emails y chatbot

`POST /api/notifications/reservation` recibe un evento y el ID de reserva. El
servidor obtiene destinatario, recurso y reserva desde Supabase; no confia en
emails enviados por el navegador. Resend recibe una clave de idempotencia y
`notification_logs` registra evento, destinatario, estado, ID del proveedor,
error y fechas. La campana muestra envios correctos, fallidos, leidos y no
leidos.

`POST /api/chat` valida la sesion, limita el historial y construye contexto
segun el rol. Un miembro solo aporta sus propias reservas. Un administrador
aporta un resumen operativo sin datos personales. Claude puede explicar
disponibilidad, reservas, cancelaciones, recursos y uso de BookDesk, pero no
puede crear ni cancelar. Ante una falla se muestra una guia local y un boton de
reintento. La conversacion se conserva unicamente en `sessionStorage`.

## 3. CSV para Estadistica

El panel `/admin/reports` calcula reservas, horas activas, cancelaciones,
bloqueos y recurso mas utilizado. Permite filtrar por fechas, recurso, tipo y
estado. El mismo transformador se usa en la pantalla, la descarga y
`scripts/export-statistics.mjs`, evitando resultados diferentes.

Ejemplo de cinco registros:

```csv
r001,2026-04-07,martes,Sala Alpha,Sala,2,8,09:00,11:00,120,Confirmada,No,USR-340CA71C
r002,2026-04-07,martes,Sala Alpha,Sala,2,8,14:00,16:00,120,Confirmada,No,USR-370CABD5
r003,2026-04-09,jueves,Sala Alpha,Sala,2,8,10:00,12:00,120,Confirmada,No,USR-370CABD5
r004,2026-04-08,miercoles,Sala Beta,Sala,1,4,11:00,13:00,120,Confirmada,No,USR-340CA71C
r005,2026-04-10,viernes,Sala Beta,Sala,1,4,09:00,10:00,60,Pendiente,No,USR-370CABD5
```

No se exportan emails ni nombres. El identificador se reemplaza por un hash
estable con prefijo `USR-`.

## 4. Verificacion mediante pruebas y capturas

Se ejecutaron 18 pruebas unitarias distribuidas en reglas de reserva,
transformacion estadistica, limites del chatbot y plantillas de email. Tambien
se ejecuto el build de Vite y el exportador, que genero 10 registros demo.

Comandos:

```bash
cd frontend
npm test
npm run build
npm run export:statistics
```

Para la evidencia final deben agregarse capturas del correo recibido, la fila de
`notification_logs`, la campana, el chat y el panel Reportes en Vercel Preview.
Las pruebas externas requieren las claves reales y el dominio verificado.

## 5. Reflexion del equipo

La mejora mostro que integrar inteligencia artificial no consiste solamente en
agregar una ventana de chat. Fue necesario definir limites, permisos, costos y
un comportamiento seguro ante fallas. Tambien aprendimos a separar la reserva
de la notificacion: el correo aporta valor, pero no debe controlar la
consistencia del sistema.

El CSV fue una mejora mas simple, aunque obligo a pensar privacidad,
reproducibilidad y calidad de datos. Compartir un unico transformador entre el
panel y el script redujo errores. Como siguiente paso mediriamos entregabilidad
de correos, preguntas frecuentes del chat y ocupacion por franja horaria.

## Anexo reservado - Analisis Numerico

Se reserva esta seccion hasta recibir la consigna especifica. Podra usar el CSV
anonimizado para medidas descriptivas, distribuciones, ocupacion por recurso y
comparaciones por periodo.
