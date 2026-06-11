from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "informe-integrador.pdf"

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="BookDeskTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=29,
        textColor=colors.HexColor("#181c23"),
        alignment=TA_CENTER,
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=21,
        textColor=colors.HexColor("#0058bc"),
        spaceAfter=12,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyBookDesk",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.2,
        leading=15,
        textColor=colors.HexColor("#414755"),
        spaceAfter=9,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.2,
        leading=9,
        textColor=colors.HexColor("#414755"),
    )
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#d8d9e5"))
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#717786"))
    canvas.drawString(18 * mm, 9 * mm, "BookDesk - Asistencia y Comunicacion Inteligente")
    canvas.drawRightString(192 * mm, 9 * mm, f"Pagina {doc.page}")
    canvas.restoreState()


def p(text):
    return Paragraph(text, styles["BodyBookDesk"])


story = [
    Spacer(1, 14 * mm),
    Paragraph("BookDesk", styles["BookDeskTitle"]),
    Paragraph("Informe integrador", styles["BookDeskTitle"]),
    Paragraph("Asistencia y Comunicacion Inteligente", styles["Section"]),
    p(
        "La mejora integra emails transaccionales con Resend, un asistente "
        "contextual con Claude y reportes CSV anonimizados para un sistema de "
        "reservas de coworking."
    ),
    Spacer(1, 8 * mm),
    Paragraph("1. Mejora elegida y problema resuelto", styles["Section"]),
    p(
        "El sistema original confirmaba reservas solo dentro de la interfaz, "
        "obligaba al usuario a recorrer pantallas para resolver dudas y no "
        "ofrecia al administrador una salida preparada para analisis."
    ),
    p(
        "La solucion mantiene las claves privadas en Vercel Functions, valida "
        "el JWT de Supabase y guarda la operacion principal antes de intentar "
        "el email. Una falla externa se informa, pero nunca revierte una "
        "reserva o cancelacion correctamente persistida."
    ),
    PageBreak(),
    Paragraph("2. Emails y chatbot", styles["Section"]),
    p(
        "<b>Notificaciones.</b> El endpoint recibe evento e ID, obtiene reserva, "
        "recurso y destinatario desde Supabase y envia una plantilla BookDesk "
        "en espanol. Una clave de idempotencia y la restriccion unica del log "
        "evitan correos duplicados."
    ),
    p(
        "<b>Auditoria.</b> notification_logs conserva destinatario, canal, "
        "evento, estado, ID de Resend, error y fechas. La campana muestra "
        "envios correctos o fallidos y permite distinguir leidos de no leidos."
    ),
    p(
        "<b>Claude.</b> El endpoint limita historial, longitud y salida. El "
        "miembro solo aporta sus propias reservas; el administrador recibe un "
        "resumen sin datos personales. El asistente no ejecuta acciones y "
        "guia hacia Reservar o Mis reservas."
    ),
    p(
        "<b>Degradacion.</b> Si Claude no responde, la interfaz ofrece una guia "
        "local, reintento y limpieza. El historial vive solo en la sesion del "
        "navegador."
    ),
    PageBreak(),
    Paragraph("3. CSV para Estadistica", styles["Section"]),
    p(
        "El panel Reportes filtra por fechas, recurso, tipo y estado. Calcula "
        "total de reservas, horas activas, cancelaciones, bloqueos y recurso "
        "mas utilizado. El script reproducible usa Supabase o datos demo."
    ),
    p("Cinco lineas de ejemplo:"),
    Table(
        [
            ["ID", "Fecha", "Recurso", "Min", "Estado", "Usuario"],
            ["r001", "2026-04-07", "Sala Alpha", "120", "Confirmada", "USR-340CA71C"],
            ["r002", "2026-04-07", "Sala Alpha", "120", "Confirmada", "USR-370CABD5"],
            ["r003", "2026-04-09", "Sala Alpha", "120", "Confirmada", "USR-370CABD5"],
            ["r004", "2026-04-08", "Sala Beta", "120", "Confirmada", "USR-340CA71C"],
            ["r005", "2026-04-10", "Sala Beta", "60", "Pendiente", "USR-370CABD5"],
        ],
        colWidths=[18 * mm, 28 * mm, 36 * mm, 15 * mm, 27 * mm, 38 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0058bc")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d8d9e5")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f1f3fe")]),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        ),
    ),
    Spacer(1, 6 * mm),
    p("No se exportan emails ni nombres. Cada usuario recibe un ID estable anonimizado."),
    PageBreak(),
    Paragraph("4. Verificacion", styles["Section"]),
    p(
        "Se ejecutaron 18 pruebas unitarias: reglas de reserva, transformacion "
        "estadistica, escape CSV, limites del chatbot y plantillas de email. "
        "Tambien se valido el build de produccion y una exportacion de 10 filas."
    ),
    p("<b>Comandos:</b> npm test; npm run build; npm run export:statistics."),
    p(
        "<b>Evidencia externa pendiente de credenciales:</b> captura del correo "
        "recibido, notification_logs, campana, chat y Reportes en Vercel Preview."
    ),
    p(
        "<b>Aceptacion:</b> confirmar y cancelar, verificar idempotencia, impedir "
        "consultas ajenas, rechazar acciones del chat, comprobar ausencia de "
        "secretos VITE y validar encabezados, escape, duracion y cinco registros."
    ),
    PageBreak(),
    Paragraph("5. Reflexion del equipo", styles["Section"]),
    p(
        "Integrar IA requirio definir permisos, costos, limites y fallas, no "
        "solamente agregar una ventana de chat. Separar la reserva del correo "
        "fue clave para conservar consistencia."
    ),
    p(
        "El CSV obligo a trabajar privacidad y reproducibilidad. Compartir un "
        "transformador entre pantalla, descarga y script redujo resultados "
        "contradictorios."
    ),
    Paragraph("Analisis Numerico", styles["Section"]),
    p(
        "Se reserva esta seccion hasta recibir la consigna especifica. El CSV "
        "anonimizado permite medidas descriptivas, distribuciones, ocupacion "
        "por recurso y comparaciones por periodo."
    ),
]

document = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=18 * mm,
    leftMargin=18 * mm,
    topMargin=18 * mm,
    bottomMargin=20 * mm,
    title="Informe integrador BookDesk",
    author="Equipo KodoLabs",
)
document.build(story, onFirstPage=footer, onLaterPages=footer)
print(f"PDF generado: {OUTPUT}")
