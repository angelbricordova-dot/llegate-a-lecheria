"""Estilo y piezas comunes de los PDF de propuestas para Llégate a Lechería."""
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, KeepTogether, ListFlowable, ListItem,
    PageTemplate, Paragraph, Spacer, Table, TableStyle,
)

TEAL = colors.HexColor("#0b5f78")
INK = colors.HexColor("#1d2a30")
MUTED = colors.HexColor("#6b777c")
LINE = colors.HexColor("#c9d0d3")

W, H = letter
MARGIN = 20 * mm
CW = W - 2 * MARGIN  # ancho útil
COVER_H = 78 * mm

base = dict(fontName="Helvetica", fontSize=10, leading=14.5, textColor=INK, alignment=TA_LEFT)
S = {
    "body": ParagraphStyle("body", **base, spaceAfter=6),
    "muted": ParagraphStyle("muted", **{**base, "textColor": MUTED, "fontSize": 9, "leading": 13}),
    "h2": ParagraphStyle("h2", **{**base, "fontName": "Helvetica-Bold", "fontSize": 13, "leading": 17,
                                  "spaceBefore": 18, "spaceAfter": 6, "keepWithNext": 1}),
    "h3": ParagraphStyle("h3", **{**base, "fontName": "Helvetica-Bold", "spaceBefore": 4, "spaceAfter": 4,
                                  "keepWithNext": 1}),
    "cell": ParagraphStyle("cell", **{**base, "fontSize": 9, "leading": 12.5}),
    "cellh": ParagraphStyle("cellh", **{**base, "fontSize": 8.5, "leading": 12, "fontName": "Helvetica-Bold",
                                        "textColor": MUTED}),
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
            borderColor=MUTED, fillColor=colors.white, textColor=INK, borderWidth=0.8, relative=True)


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
            borderColor=LINE, fillColor=colors.white, textColor=INK, borderWidth=0.8,
            fieldFlags="multiline" if self.multiline else "", relative=True)


def labeled_field(label, name, width, height=18, multiline=False, value=""):
    return [P(label, "label"), Spacer(1, 3), Field(name, label, width, height, value, multiline), Spacer(1, 8)]


def numbered(items, start=1):
    return ListFlowable(
        [ListItem(P(t), leftIndent=16, value=i) for i, t in enumerate(items, start)],
        bulletType="1", bulletFormat="%s.", bulletFontName="Helvetica", bulletColor=INK, bulletFontSize=10,
        leftIndent=16, bulletDedent=16)


def bullets(items):
    return ListFlowable([ListItem(P(t), leftIndent=12) for t in items], bulletType="bullet", start="•", bulletFontSize=8,
                        bulletColor=MUTED, leftIndent=12, bulletDedent=10)


def table(rows, widths, header=True):
    t = Table(rows, colWidths=widths, repeatRows=1 if header else 0)
    style = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]
    if header:
        style += [("LINEBELOW", (0, 0), (-1, 0), 0.6, LINE), ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
                  ("TOPPADDING", (0, 1), (-1, 1), 7)]
    t.setStyle(TableStyle(style))
    return t


def check_row(name, tooltip, html):
    """Casilla a la izquierda y texto a la derecha."""
    return Table([[Check(name, tooltip), P(html)]], colWidths=[18, CW - 18],
                 style=[("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("TOPPADDING", (0, 0), (0, 0), 2)])


def answer_field(name, tooltip, height=36):
    """Campo de respuesta sangrado bajo una casilla."""
    return Table([[Field(name, tooltip, CW - 18, height, multiline=True)]], colWidths=[CW],
                 style=[("LEFTPADDING", (0, 0), (-1, -1), 18), ("RIGHTPADDING", (0, 0), (-1, -1), 0)])


def signatures(provider_title, provider_name, client_name="Naylu Vergara"):
    """Dos columnas de firma: Llégate a la izquierda, el proveedor a la derecha."""
    half = (CW - 14) / 2

    def column(title, prefix, name):
        return [P(f"<b>{title}</b>"), Spacer(1, 4),
                *labeled_field("Nombre", f"{prefix}_nombre", half, value=name),
                *labeled_field("Cédula o RIF", f"{prefix}_documento", half),
                *labeled_field("Fecha", f"{prefix}_fecha", half),
                P("Firma", "label"), Spacer(1, 3),
                Table([[""]], colWidths=[half], rowHeights=[22 * mm], style=[("BOX", (0, 0), (-1, -1), 0.8, LINE)])]

    return Table([[column("Por Llégate a Lechería C.A.", "cliente", client_name),
                   column(provider_title, "dev", provider_name)]],
                 colWidths=[half + 7, half + 7],
                 style=[("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (0, 0), 14)])


def comments_and_acceptance(approval_text, provider_title, provider_name):
    return [KeepTogether([
        P("Comentarios", "h2"),
        *labeled_field("Cualquier duda, cambio o comentario sobre la propuesta:", "comentarios", CW, 70,
                       multiline=True),
    ]), KeepTogether([
        P("Aceptación", "h2"),
        P(approval_text),
        check_row("acepto", "Acepto la propuesta y sus términos",
                  "<b>He leído y acepto esta propuesta y sus términos y condiciones.</b>"),
        Spacer(1, 10), signatures(provider_title, provider_name),
    ])]


def make_doc(output, logo, title, byline, author, subject):
    """Documento carta con portada blanca (logo, título y una línea de datos) y número de página al pie."""
    def footer(canv, doc):
        canv.setFont("Helvetica", 8.5)
        canv.setFillColor(MUTED)
        canv.drawRightString(W - MARGIN, 11 * mm, str(doc.page))

    def first_page(canv, doc):
        canv.saveState()
        size = 26 * mm
        canv.drawImage(logo, MARGIN - 2 * mm, H - MARGIN - size, width=size, height=size, mask="auto")
        canv.setFillColor(INK)
        canv.setFont("Helvetica-Bold", 22)
        canv.drawString(MARGIN, H - 63 * mm, title)
        canv.setFillColor(MUTED)
        canv.setFont("Helvetica", 10)
        canv.drawString(MARGIN, H - 70 * mm, byline)
        footer(canv, doc)
        canv.restoreState()

    def later_pages(canv, doc):
        canv.saveState()
        footer(canv, doc)
        canv.restoreState()

    doc = BaseDocTemplate(output, pagesize=letter, leftMargin=MARGIN, rightMargin=MARGIN,
                          topMargin=MARGIN, bottomMargin=20 * mm, title=title, author=author, subject=subject)
    pad0 = dict(leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([
        PageTemplate(id="First", frames=[Frame(MARGIN, 20 * mm, CW, H - COVER_H - 20 * mm, id="first", **pad0)],
                     onPage=first_page, autoNextPageTemplate="Rest"),
        PageTemplate(id="Rest", frames=[Frame(MARGIN, 20 * mm, CW, H - MARGIN - 20 * mm, id="rest", **pad0)],
                     onPage=later_pages),
    ])
    return doc
