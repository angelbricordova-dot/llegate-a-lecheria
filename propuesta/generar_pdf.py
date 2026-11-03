"""Genera el PDF rellenable de la propuesta para Llégate a Lechería.

Uso: python3 propuesta/generar_pdf.py <logo.png> <salida.pdf>
"""
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, KeepTogether, ListFlowable, ListItem,
    PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

LOGO, SALIDA = sys.argv[1], sys.argv[2]

TEAL = colors.HexColor("#0b5f78")
TEAL_SOFT = colors.HexColor("#e3f1f2")
SUN = colors.HexColor("#f7bf55")
INK = colors.HexColor("#0e2f3a")
MUTED = colors.HexColor("#5a7480")
LINE = colors.HexColor("#d6e6e4")
FIELD_BG = colors.HexColor("#f4f9f8")

W, H = letter
MARGIN = 20 * mm

base = dict(fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK, alignment=TA_LEFT)
S = {
    "body": ParagraphStyle("body", **base, spaceAfter=6),
    "muted": ParagraphStyle("muted", **{**base, "textColor": MUTED, "fontSize": 9, "leading": 13}),
    "h2": ParagraphStyle("h2", **{**base, "fontName": "Helvetica-Bold", "fontSize": 15, "leading": 19,
                                  "textColor": TEAL, "spaceBefore": 14, "spaceAfter": 8,
                                  "keepWithNext": 1}),
    "cell": ParagraphStyle("cell", **{**base, "fontSize": 9, "leading": 12.5}),
    "cellh": ParagraphStyle("cellh", **{**base, "fontSize": 9, "leading": 12.5, "fontName": "Helvetica-Bold",
                                        "textColor": colors.white}),
    "label": ParagraphStyle("label", **{**base, "fontSize": 8.5, "leading": 11, "textColor": MUTED}),
}


def P(text, style="body"):
    return Paragraph(text, S[style])


class Check(Flowable):
    """Casilla de verificación rellenable."""
    def __init__(self, name, tooltip, size=11):
        super().__init__()
        self.name, self.tooltip, self.size = name, tooltip, size
        self.width = self.height = size

    def draw(self):
        self.canv.acroForm.checkbox(
            name=self.name, tooltip=self.tooltip, x=0, y=0, size=self.size, buttonStyle="check",
            borderColor=TEAL, fillColor=colors.white, textColor=TEAL, borderWidth=1, relative=True)


class Field(Flowable):
    """Campo de texto rellenable, de una o varias líneas."""
    def __init__(self, name, tooltip, width, height=18, value="", multiline=False):
        super().__init__()
        self.name, self.tooltip, self.value, self.multiline = name, tooltip, value, multiline
        self.width, self.height = width, height

    def draw(self):
        self.canv.acroForm.textfield(
            name=self.name, tooltip=self.tooltip, value=self.value, x=0, y=0,
            width=self.width, height=self.height, fontName="Helvetica", fontSize=9.5,
            borderColor=LINE, fillColor=FIELD_BG, textColor=INK, borderWidth=1,
            fieldFlags="multiline" if self.multiline else "", relative=True)


def labeled_field(label, name, width, height=18, multiline=False, value=""):
    return [P(label, "label"), Spacer(1, 3), Field(name, label, width, height, value, multiline), Spacer(1, 8)]


def numbered(items, start=1):
    return ListFlowable(
        [ListItem(P(t), leftIndent=16, value=i) for i, t in enumerate(items, start)],
        bulletType="1", bulletFontName="Helvetica-Bold", bulletColor=TEAL, bulletFontSize=10,
        leftIndent=16, bulletDedent=16)


def bullets(items):
    return ListFlowable([ListItem(P(t), leftIndent=12) for t in items], bulletType="bullet", start="•",
                        bulletColor=TEAL, leftIndent=12, bulletDedent=10)


def table(rows, widths, header=True):
    t = Table(rows, colWidths=widths, repeatRows=1 if header else 0)
    style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINE),
    ]
    if header:
        style += [("BACKGROUND", (0, 0), (-1, 0), TEAL)]
    t.setStyle(TableStyle(style))
    return t


def note_box(flowables, bg=TEAL_SOFT):
    t = Table([[flowables]], colWidths=[W - 2 * MARGIN])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg), ("BOX", (0, 0), (-1, -1), 0, bg),
        ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ]))
    return t


CW = W - 2 * MARGIN  # ancho útil

# ---------- Páginas ----------

COVER_H = 62 * mm


def first_page(canv, doc):
    canv.saveState()
    canv.setFillColor(TEAL)
    canv.rect(0, H - COVER_H, W, COVER_H, stroke=0, fill=1)
    canv.setFillColor(SUN)
    canv.rect(0, H - COVER_H - 2.2 * mm, W, 2.2 * mm, stroke=0, fill=1)
    logo_h = 46 * mm
    canv.drawImage(LOGO, W - MARGIN - logo_h, H - COVER_H + 8 * mm, width=logo_h, height=logo_h, mask="auto")
    canv.setFillColor(SUN)
    canv.setFont("Helvetica-Bold", 9)
    canv.drawString(MARGIN, H - 20 * mm, "PROPUESTA · FASE 1")
    canv.setFillColor(colors.white)
    canv.setFont("Helvetica-Bold", 23)
    canv.drawString(MARGIN, H - 31 * mm, "Sistema administrativo")
    canv.drawString(MARGIN, H - 40 * mm, "para Llégate a Lechería")
    canv.setFont("Helvetica", 10)
    canv.drawString(MARGIN, H - 49 * mm, "Para Naylu Vergara · Llégate a Lechería C.A.")
    canv.drawString(MARGIN, H - 54.5 * mm, "Preparada por Alejandro Lamont · 2 de noviembre de 2026")
    footer(canv, doc)
    canv.restoreState()


def later_pages(canv, doc):
    canv.saveState()
    footer(canv, doc)
    canv.restoreState()


def footer(canv, doc):
    canv.setStrokeColor(LINE)
    canv.line(MARGIN, 14 * mm, W - MARGIN, 14 * mm)
    canv.setFont("Helvetica", 8)
    canv.setFillColor(MUTED)
    canv.drawString(MARGIN, 10 * mm, "Llégate a Lechería · Propuesta de sistema administrativo · Fase 1")
    canv.drawRightString(W - MARGIN, 10 * mm, f"Página {doc.page}")


doc = BaseDocTemplate(SALIDA, pagesize=letter, leftMargin=MARGIN, rightMargin=MARGIN,
                      topMargin=MARGIN, bottomMargin=20 * mm,
                      title="Propuesta de sistema para Llégate a Lechería", author="Alejandro Lamont",
                      subject="Propuesta Fase 1 para Llégate a Lechería C.A.")
frame_first = Frame(MARGIN, 20 * mm, CW, H - COVER_H - 12 * mm - 20 * mm, id="first")
frame_rest = Frame(MARGIN, 20 * mm, CW, H - MARGIN - 20 * mm, id="rest")
doc.addPageTemplates([
    PageTemplate(id="First", frames=[frame_first], onPage=first_page, autoNextPageTemplate="Rest"),
    PageTemplate(id="Rest", frames=[frame_rest], onPage=later_pages),
])

story = []

story.append(note_box([
    P("<b>Cómo usar este PDF.</b> Puedes marcar las casillas, escribir en los campos grises y firmar al final. "
      "Desde el celular o la computadora, ábrelo con Adobe Acrobat Reader (gratis) y usa "
      "<b>Rellenar y firmar</b>. Al terminar, guárdalo y envíamelo por WhatsApp o correo.", "body"),
]))

# Resumen
story += [P("Resumen", "h2"),
          P("Te propongo construir el sistema administrativo de Llégate a Lechería por fases, empezando por lo que "
            "marcaste como prioridad para el primer mes: control de cobros con recordatorios, cotizaciones formales "
            "y el cálculo de lo que corresponde a cada propietario o anfitrión."),
          bullets([
              "<b>Fase 1:</b> 260 USD en 3 cuotas, entrega el viernes 27 de noviembre de 2026. Incluye una agenda y "
              "fichas de ingreso listas para el anfitrión que llega en diciembre.",
              "<b>Plan mensual:</b> entre 35 y 50 USD desde la entrega, para mantener el sistema funcionando.",
              "<b>Fases 2 y 3:</b> se cotizan por separado cuando la Fase 1 esté funcionando y hayas evaluado los "
              "resultados.",
              "<b>Chatbot:</b> no forma parte de esta propuesta. Lo cotiza por separado Luis Enrique.",
          ])]

# Lo que entendimos
rows = [[P("Proceso", "cellh"), P("Cómo se hace hoy", "cellh"), P("Problema", "cellh")]] + [
    [P(a, "cell"), P(b, "cell"), P(c, "cell")] for a, b, c in [
        ("Confirmación de reservas", "Plantilla de texto pegada en el grupo de Telegram \"Producción\", que la "
         "guarda en el Excel del mes", "Falla cuando la reserva no sigue el caso normal"),
        ("Cobros", "50% al reservar y el resto al llegar; recordatorios del bot de Telegram",
         "No registra bien los casos especiales, como todo cobrado en la reserva o descuentos"),
        ("Comisiones y liquidaciones", "Excel de ingresos; la comisión cambia según la temporada",
         "Calcular lo que corresponde a cada propietario es manual"),
        ("Cotizaciones", "Texto o PDF armado con ayuda de IA", "No hay un formato formal y fijo"),
        ("Reportes a propietarios", "Se arman pasando los Excel a una IA", "Es lento y depende de ti"),
        ("Cartera de propiedades", "Notion y el Excel \"Inventario maestro\"", "Duplicada y desactualizada"),
        ("Finanzas de la empresa", "Un Excel de ingresos y otro de gastos", "Separados y difíciles de leer"),
    ]]
story += [P("Lo que entendimos", "h2"),
          P("Llégate gestiona más de 30 propiedades de distintos propietarios y anfitriones, y hoy su información "
            "vive repartida en muchas herramientas. Eso hace que se pierdan datos, que actualizar algo cueste y que "
            "delegar el trabajo dependa de revisar todo a mano."),
          table(rows, [CW * 0.24, CW * 0.42, CW * 0.34]), Spacer(1, 8),
          P("Pediste expresamente que el Excel siga existiendo como respaldo, que el sistema permita corregir casos "
            "especiales sin depender del programador y que todo quede integrado en un solo lugar.")]

# Fase 1
story += [P("Fase 1: alcance", "h2"),
          P("La Fase 1 entrega un sistema web, usable desde el celular y la computadora, que reemplaza al bot de "
            "Telegram \"Producción\" y al Excel mensual de reservas."),
          numbered([
              "<b>Registro de reservas.</b> Cliente, propiedad, fechas, noches, número de personas, canal de origen, "
              "estado de procedencia, red social, motivo del viaje, rango de edad y si es cliente recurrente.",
              "<b>Control de cobros.</b> Abono del 50% al reservar y saldo al llegar, con el método de pago de cada "
              "uno: pago móvil, transferencia nacional, Zelle, Binance/USDT o efectivo. Cada reserva muestra si está "
              "pagada, abonada o pendiente.",
              "<b>Ajustes manuales.</b> Puedes corregir cualquier reserva sin programador: todo cobrado en la "
              "reserva, descuentos negociados, cambios de fecha y estadías sin cobro.",
              "<b>Comisiones por temporada.</b> Porcentaje de temporada baja y alta que tú configuras, con las "
              "fechas de cada temporada.",
              "<b>Liquidaciones.</b> El sistema calcula, por reserva y por mes, cuánto corresponde a cada "
              "propietario o anfitrión y cuánto a Llégate.",
              "<b>Resumen del mes.</b> Una pantalla para ti con ingresos, comisiones ganadas, saldos por cobrar y "
              "liquidaciones pendientes.",
              "<b>Recordatorios de cobro.</b> Notificación en el celular de los saldos pendientes y de las llegadas "
              "y salidas del día siguiente.",
              "<b>Cotizaciones en PDF.</b> La asesora rellena los datos y el sistema genera la cotización con la "
              "marca de Llégate, lista para enviar.",
              "<b>Agenda del anfitrión.</b> Las llegadas y salidas de la semana, con propiedad, hora prevista y "
              "contacto del huésped, para coordinar la entrega de llaves.",
              "<b>Fichas de ingreso para vigilancia.</b> Se generan en PDF desde la reserva con los datos que envía "
              "el huésped: nombres, cédulas, teléfono y vehículo.",
              "<b>Accesos por persona.</b> Cuentas para ti, la asesora y el anfitrión. La asesora no ve las finanzas "
              "de la empresa ni los gastos. El anfitrión ve solo su agenda y las fichas.",
              "<b>Respaldo en tiempo real.</b> Cada cambio se copia al Google Sheets de Llégate, que sigue siendo la "
              "base madre de datos.",
              "<b>Migración inicial.</b> Carga de las propiedades y de las reservas activas desde los Excel actuales.",
              "<b>Capacitación.</b> Una sesión por videollamada para ti, la asesora y el anfitrión, y una guía corta "
              "de uso.",
          ]),
          Spacer(1, 6),
          P("Todos los montos se registran en euros. Antes de empezar confirmaremos contigo cómo convertir los pagos "
            "en bolívares y qué tasa usar."),
          Spacer(1, 4),
          KeepTogether(labeled_field("¿Quieres cambiar, quitar o añadir algo de la Fase 1? Escríbelo aquí:",
                                     "cambios_fase1", CW, 54, multiline=True))]

# Qué no incluye
story += [P("Qué no incluye la Fase 1", "h2"),
          P("Lo siguiente queda fuera de la Fase 1 y, si lo quieres, se cotiza aparte:"),
          bullets([
              "Avisos por WhatsApp. En la Fase 1 los avisos llegan como notificación en el celular, porque la cuenta "
              "de Meta de Llégate tiene hoy restringido el uso de números de WhatsApp.",
              "Finanzas de la empresa con registro de gastos, seguimiento posventa del anfitrión, reseñas y captación "
              "de propiedades (Fase 2).",
              "Portal del propietario, cartera única de propiedades, catálogo web con disponibilidad y lectura "
              "automática de cédula y placa en las fichas (Fase 3).",
              "El chatbot de WhatsApp e Instagram y la solución de la restricción de la cuenta de Meta.",
              "Cambios en la página web actual llegate.net.",
              "Fotografía, video o redacción de textos de las propiedades.",
              "Pagos en línea dentro del sistema.",
          ])]

# Plazos
story += [P("Plazos", "h2"),
          P("La Fase 1 se entrega el viernes 27 de noviembre de 2026, siempre que la propuesta se apruebe y el primer "
            "pago se haga antes del viernes 6 de noviembre."),
          numbered([
              "<b>Del 2 al 6 de noviembre.</b> Aprobación, primer pago, respuestas a las preguntas pendientes y "
              "entrega de accesos y Excel actuales.",
              "<b>Del 9 al 14 de noviembre.</b> Estructura de datos, registro de reservas y control de cobros.",
              "<b>Del 16 al 21 de noviembre.</b> Comisiones, liquidaciones, resumen del mes, cotizaciones en PDF, "
              "notificaciones y respaldo en Google Sheets.",
              "<b>Del 23 al 27 de noviembre.</b> Agenda del anfitrión, fichas de ingreso, migración de datos, pruebas "
              "con reservas reales junto contigo y la asesora, capacitación y entrega.",
          ]),
          Spacer(1, 6),
          P("Durante la última semana el bot de Telegram sigue activo. Se apaga cuando confirmes que el sistema "
            "registra bien las reservas reales.")]

# Inversión
rows = [[P("Cuota", "cellh"), P("Monto", "cellh"), P("Cuándo se paga", "cellh")]] + [
    [P(a, "cell"), P(f"<b>{b}</b>", "cell"), P(c, "cell")] for a, b, c in [
        ("1", "100 USD", "Al aprobar la propuesta, antes del 6 de noviembre"),
        ("2", "80 USD", "Al mostrar el registro de reservas y cobros funcionando, el 14 de noviembre"),
        ("3", "80 USD", "En la entrega, el 27 de noviembre"),
    ]] + [[P("<b>Total</b>", "cell"), P("<b>260 USD</b>", "cell"), P("", "cell")]]
story += [KeepTogether([
    P("Inversión", "h2"),
    P("La Fase 1 cuesta 260 USD, pagados en 3 cuotas ligadas a avances visibles."),
    table(rows, [CW * 0.14, CW * 0.2, CW * 0.66]), Spacer(1, 8),
    P("Desde diciembre de 2026 empieza el plan mensual, de entre 35 y 50 USD. Cubre el alojamiento del sistema, la "
      "base de datos, las notificaciones, las copias de seguridad, la corrección de fallos y el soporte por "
      "WhatsApp. El monto exacto se fija por escrito antes de la entrega, dentro de ese rango, según los servicios "
      "que el sistema use."),
])]

# Fases siguientes
fases = [
    ("2", "Finanzas de la empresa con ingresos y gastos", "Imprescindible"),
    ("2", "Seguimiento posventa del anfitrión: contacto durante la estadía, encuestas y material POP",
     "Imprescindible"),
    ("2", "Reseñas: solicitud al día siguiente de la salida, tu aprobación y muro en la web", "Imprescindible"),
    ("2", "Captación de propiedades: checklist de visita, propuesta enviada y texto de venta", "Imprescindible"),
    ("2", "Botón \"habla con la asesora\" y formulario de atención en la web", "Imprescindible"),
    ("3", "Portal del propietario: fechas, ingresos, reporte mensual y actualización de precios", "Me interesa"),
    ("3", "Cartera única de propiedades, en lugar de Notion y el Inventario maestro", "Me interesa"),
    ("3", "Catálogo web con disponibilidad leída de los calendarios de Airbnb", "Me interesa"),
    ("3", "Lectura automática de cédula y placa para las fichas de ingreso", "Me interesa"),
]
rows = [[P("Fase", "cellh"), P("Qué incluye", "cellh"), P("Tu prioridad", "cellh"), P("Cotizar ya", "cellh")]] + [
    [P(f, "cell"), P(q, "cell"), P(p, "cell"), Check(f"cotizar_{i}", f"Quiero que me lo coticen: {q}")]
    for i, (f, q, p) in enumerate(fases, 1)]
story += [P("Fases siguientes", "h2"),
          P("Las Fases 2 y 3 completan el resto de módulos que pediste. Cada una se cotiza y se aprueba por separado, "
            "cuando la anterior esté funcionando. Marca en la última columna lo que quieras que te cotice desde ya."),
          table(rows, [CW * 0.09, CW * 0.6, CW * 0.17, CW * 0.14]), Spacer(1, 8),
          P("La agenda del anfitrión y las fichas de ingreso básicas ya llegan en la Fase 1. Al cerrarla revisaremos "
            "contigo los resultados y el orden de la Fase 2.")]

# Chatbot
story += [P("Chatbot: servicio aparte", "h2"),
          P("El chatbot de WhatsApp e Instagram no forma parte de esta propuesta. Lo cotiza y lo desarrolla Luis "
            "Enrique por separado, a partir de tus respuestas a su cuestionario."),
          P("Si contratas ambos servicios, el sistema de la Fase 1 queda preparado para conectarse con el chatbot más "
            "adelante, por ejemplo para leer la disponibilidad o registrar reservas.")]

# Lo que necesitamos
story += [P("Lo que necesitamos de Llégate", "h2"),
          P("Para cumplir la fecha del 27 de noviembre necesitamos lo siguiente antes del 6 de noviembre. Puedes "
            "responder las cuatro primeras aquí mismo y marcar el resto cuando lo envíes.")]
preguntas = [
    ("moneda", "Moneda y tasa", "Si los precios en euros son solo de referencia y se cobran en bolívares, y qué "
     "tasa se usa (BCV u otra)."),
    ("comisiones", "Comisiones", "El porcentaje de temporada baja y el de temporada alta, y las fechas de cada "
     "temporada."),
    ("flujo", "Flujo del dinero", "Quién recibe el 50% de la reserva, quién recibe el saldo y cuándo se paga al "
     "propietario o anfitrión."),
    ("precios", "Precios mientras no exista el portal", "Confirmar que, hasta la Fase 3, los actualiza la asesora."),
]
for key, titulo, texto in preguntas:
    story.append(KeepTogether([
        Table([[Check(f"listo_{key}", f"Respondido: {titulo}"), P(f"<b>{titulo}.</b> {texto}")]],
              colWidths=[18, CW - 18],
              style=[("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                     ("TOPPADDING", (0, 0), (0, 0), 2)]),
        Spacer(1, 3),
        Table([[Field(f"respuesta_{key}", f"Respuesta: {titulo}", CW - 18, 36, multiline=True)]],
              colWidths=[CW], style=[("LEFTPADDING", (0, 0), (-1, -1), 18)]),
        Spacer(1, 8),
    ]))
entregas = [
    ("archivos", "Archivos actuales", "Copia del Excel de reservas, del de ingresos, del de gastos y del Inventario "
     "maestro, y un modelo de la ficha de ingreso que piden los condominios."),
    ("google", "Google Sheets de respaldo", "Una cuenta de Google de Llégate donde vivirá la base madre."),
    ("usuarios", "Usuarios", "Tu nombre y correo, y los de la asesora y el anfitrión de diciembre."),
    ("marca", "Marca", "Logo en buena calidad para las cotizaciones y las fichas en PDF."),
]
for key, titulo, texto in entregas:
    story.append(Table([[Check(f"enviado_{key}", f"Enviado: {titulo}"), P(f"<b>{titulo}.</b> {texto}")]],
                       colWidths=[18, CW - 18],
                       style=[("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                              ("TOPPADDING", (0, 0), (0, 0), 2)]))

# Términos
story += [P("Términos y condiciones", "h2"),
          numbered([
              "<b>Alcance cerrado.</b> El precio cubre solo lo descrito en \"Fase 1: alcance\". Cualquier función "
              "nueva se cotiza por escrito y se aprueba antes de hacerla.",
              "<b>Ajustes durante el desarrollo.</b> Hasta la entrega se pueden pedir sin costo cambios de textos, "
              "campos o pantallas dentro de los módulos incluidos.",
              "<b>Acuerdos por escrito.</b> Todo cambio de alcance, precio o fecha se confirma por WhatsApp o correo, "
              "para que quede registro.",
              "<b>Pagos y fechas.</b> Si una cuota se retrasa, el trabajo se pausa y la entrega se mueve los mismos "
              "días. Lo mismo ocurre si la información de \"Lo que necesitamos de Llégate\" llega tarde.",
              "<b>Garantía.</b> Durante los 30 días siguientes a la entrega, los fallos de lo entregado se corrigen "
              "sin costo.",
              "<b>Plan mensual.</b> Se paga por adelantado cada mes. Si se deja de pagar, se avisa con 15 días antes "
              "de suspender el sistema.",
              "<b>Datos de Llégate.</b> Los datos de reservas, clientes, propietarios y finanzas pertenecen siempre a "
              "Llégate. Están respaldados en su Google Sheets y los conserva aunque el servicio termine.",
              "<b>Confidencialidad.</b> Los datos de huéspedes, propietarios y finanzas se usan solo para prestar el "
              "servicio y no se comparten con terceros.",
              "<b>Servicios de terceros.</b> El sistema usa servicios externos como Google, el alojamiento web y las "
              "notificaciones. Si uno de ellos cambia sus precios o condiciones, se avisará antes de ajustar el plan "
              "mensual.",
              "<b>Validez.</b> Esta propuesta es válida hasta el 6 de noviembre de 2026. Si se aprueba después, las "
              "fechas se recalculan.",
          ])]

# Comentarios y aceptación
half = (CW - 14) / 2
sig_box = Table([[""]], colWidths=[half], rowHeights=[22 * mm],
                style=[("BOX", (0, 0), (-1, -1), 0.8, LINE), ("BACKGROUND", (0, 0), (-1, -1), FIELD_BG)])
left = [P("<b>Por Llégate a Lechería C.A.</b>"), Spacer(1, 4),
        *labeled_field("Nombre", "cliente_nombre", half, value="Naylu Vergara"),
        *labeled_field("Cédula o RIF", "cliente_documento", half),
        *labeled_field("Fecha", "cliente_fecha", half),
        P("Firma", "label"), Spacer(1, 3), sig_box]
right = [P("<b>Por el desarrollador</b>"), Spacer(1, 4),
         *labeled_field("Nombre", "dev_nombre", half, value="Alejandro Lamont"),
         *labeled_field("Cédula o RIF", "dev_documento", half),
         *labeled_field("Fecha", "dev_fecha", half),
         P("Firma", "label"), Spacer(1, 3),
         Table([[""]], colWidths=[half], rowHeights=[22 * mm],
               style=[("BOX", (0, 0), (-1, -1), 0.8, LINE), ("BACKGROUND", (0, 0), (-1, -1), FIELD_BG)])]
firmas = Table([[left, right]], colWidths=[half + 7, half + 7],
               style=[("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                      ("RIGHTPADDING", (0, 0), (0, 0), 14)])

story += [KeepTogether([
    P("Comentarios", "h2"),
    *labeled_field("Cualquier duda, cambio o comentario sobre la propuesta:", "comentarios", CW, 70, multiline=True),
]), KeepTogether([
    P("Aceptación", "h2"),
    P("La propuesta queda aprobada con la firma de ambas partes y el pago de la primera cuota."),
    Table([[Check("acepto", "Acepto la propuesta y sus términos"),
            P("<b>He leído y acepto esta propuesta y sus términos y condiciones.</b>")]],
          colWidths=[18, CW - 18],
          style=[("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                 ("TOPPADDING", (0, 0), (0, 0), 2)]),
    Spacer(1, 10), firmas,
    Spacer(1, 6),
    P("Para firmar: en Acrobat Reader toca <b>Rellenar y firmar</b> y luego <b>Firmar</b>, dibuja tu firma y "
      "colócala en el recuadro.", "muted"),
])]

doc.build(story)
print("PDF generado:", SALIDA)
