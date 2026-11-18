"""Genera el PDF rellenable de la propuesta de acompañamiento para Llégate a Lechería.

Uso: python3 propuesta/generar_pdf_acompanamiento.py <logo.png> <salida.pdf>
"""
import sys

from reportlab.platypus import KeepTogether, Spacer

from pdf_base import (
    CW, P, answer_field, bullets, check_row, comments_and_acceptance, make_doc, numbered, table,
)

LOGO, SALIDA = sys.argv[1], sys.argv[2]

doc = make_doc(SALIDA, LOGO, "Acompañamiento para construir tu sistema",
               "Para Naylu Vergara, Llégate a Lechería C.A.  ·  Alejandro Lamont  ·  18 de noviembre de 2026",
               author="Alejandro Lamont", subject="Propuesta de acompañamiento para Llégate a Lechería C.A.")

story = []

# Resumen
story += [P("Resumen", "h2"),
          P("Te propongo construir juntos el sistema de Llégate: tú lo construyes en Lovable y yo te acompaño cada "
            "semana, para que entiendas todo lo que hay detrás y puedas cambiarlo y mejorarlo tú misma. Las partes "
            "técnicas más delicadas las dejo hechas yo, para que el sistema arranque seguro desde el primer día."),
          bullets([
              "<b>Arranque:</b> 200 USD, una sola vez. La base de datos, los permisos, la migración de tus Excel y el "
              "respaldo en Google Sheets, listos para construir encima.",
              "<b>Acompañamiento:</b> 120 USD al mes, con un mínimo de 3 meses. Cuatro sesiones al mes y soporte por "
              "WhatsApp.",
              "<b>Todo a tu nombre desde el primer día:</b> el proyecto, el código y tus datos.",
              "<b>Chatbot:</b> no forma parte de esta propuesta. Lo trabaja por separado Luis Enrique.",
          ])]

# Cómo trabajamos
rows = [[P("Quién", "cellh"), P("Qué hace", "cellh")]] + [
    [P(f"<b>{a}</b>", "cell"), P(b, "cell")] for a, b in [
        ("Tú construyes", "Las pantallas y funciones en Lovable: clientes, reservas, cobros, gastos y estadísticas, "
         "siguiendo el plan de cada semana."),
        ("Yo te guío", "En cada sesión te explico qué vamos a construir, cómo pedírselo a Lovable y por qué, y "
         "revisamos lo que hiciste."),
        ("Yo construyo", "Las piezas técnicas del arranque y lo que conviene no aprender en vivo con tus datos "
         "reales: base de datos, permisos y conexiones."),
    ]]
story += [P("Cómo trabajamos", "h2"),
          P("Usamos lo que ya empezaste: Lovable. El prototipo que te mostré sirve de plano, para pedirle cada "
            "pantalla tal como la quieres."),
          table(rows, [CW * 0.22, CW * 0.78])]

# Arranque
story += [KeepTogether([
    P("Arranque: 200 USD, una sola vez", "h2"),
    P("Lo dejo hecho en las dos primeras semanas, para que construyas sobre una base sólida."),
    numbered([
        "<b>Base de datos en Supabase.</b> Las tablas de propiedades, propietarios, clientes, reservas, pagos y "
        "gastos, pensadas para todo lo que quieres medir.",
        "<b>Permisos por persona.</b> Tú ves todo; la asesora no ve gastos ni ganancias. Queda configurado para "
        "que tus datos no se puedan leer desde fuera.",
        "<b>Migración de tus Excel.</b> Las propiedades, las reservas activas y el histórico de tus planillas "
        "mensuales, cargados en la base de datos.",
        "<b>Respaldo en Google Sheets.</b> Cada cambio se copia al momento a tu Excel, que sigue siendo tu base "
        "madre.",
        "<b>Tu proyecto conectado.</b> Lovable, Supabase y GitHub enlazados entre sí y a tu nombre.",
        "<b>Sesión de arranque</b> de 2 horas para recorrer juntos cómo quedó todo.",
    ]),
])]

# Acompañamiento
story += [KeepTogether([
    P("Acompañamiento: 120 USD al mes", "h2"),
    P("Lo que incluye cada mes:"),
    numbered([
        "<b>Cuatro sesiones de 1 hora y media</b> por videollamada, una por semana, en el horario que te quede "
        "mejor. Quedan grabadas para que las repases.",
        "<b>Un plan para cada semana:</b> qué vas a construir y con qué indicaciones pedírselo a Lovable.",
        "<b>Revisión de lo que construyes</b> antes de cada sesión, con lo que hay que corregir y por qué.",
        "<b>Soporte por WhatsApp</b> de lunes a viernes, con respuesta en el mismo día hábil.",
        "<b>Cuidado de la seguridad:</b> cada vez que agregues algo nuevo, reviso que los permisos sigan bien.",
        "<b>Una guía escrita</b> de lo que vamos construyendo, para que cualquiera pueda entenderlo después.",
    ]),
])]

# Lo que vas a aprender
story += [P("Lo que vas a aprender", "h2"),
          bullets([
              "Pedirle a Lovable pantallas y cambios con indicaciones claras, y revisar lo que hace.",
              "Cómo se guardan tus datos: tablas, relaciones y por qué cada cosa va donde va.",
              "Dar y quitar permisos a cada persona de tu equipo.",
              "Publicar mejoras sin romper lo que ya funciona, y volver atrás si algo sale mal.",
              "Leer y ajustar tus propias estadísticas: qué conjuntos rinden, cuáles no rotan y cómo vas frente al "
              "año pasado.",
          ])]

# Plan de tres meses
plan = [[P("Mes", "cellh"), P("Qué construimos", "cellh")]] + [
    [P(f"<b>{a}</b>", "cell"), P(b, "cell")] for a, b in [
        ("Mes 1", "El arranque y tus clientes: el CRM por fases, las fichas y el registro de reservas."),
        ("Mes 2", "Cobros, abonos y saldos, liquidaciones a propietarios y gastos de la empresa."),
        ("Mes 3", "Estadísticas, cotizaciones en PDF y la conexión con el chatbot de Luis Enrique."),
    ]]
story += [KeepTogether([
    P("Un plan para los primeros 3 meses", "h2"),
    P("Es una guía, no una camisa de fuerza: lo ajustamos según cómo vayas y lo que pida la temporada alta."),
    table(plan, [CW * 0.16, CW * 0.84]),
])]

# Herramientas y propiedad
herramientas = [[P("Herramienta", "cellh"), P("Para qué", "cellh"), P("A nombre de", "cellh")]] + [
    [P(f"<b>{a}</b>", "cell"), P(b, "cell"), P(c, "cell")] for a, b, c in [
        ("Lovable", "Donde construyes las pantallas", "Tu cuenta"),
        ("Supabase", "La base de datos y los usuarios", "Tu cuenta"),
        ("GitHub", "El código, para llevártelo a donde quieras", "Tu cuenta"),
        ("Google Sheets", "El respaldo al momento", "Tu cuenta de Google"),
    ]]
story += [KeepTogether([
    P("Herramientas y de quién es todo", "h2"),
    P("Todo se crea a tu nombre desde el primer día y yo trabajo con acceso. Si un día dejamos de trabajar juntos, "
      "te quedas con todo, sin rehacer nada."),
    table(herramientas, [CW * 0.2, CW * 0.52, CW * 0.28]), Spacer(1, 8),
    P("Las suscripciones de estas herramientas las pagas tú directamente, según el plan que elijas en cada una. "
      "Te ayudo a escoger el más económico para lo que necesitas."),
])]

# Qué no incluye
story += [P("Qué no incluye", "h2"),
          bullets([
              "Que construya yo las pantallas por ti. Si alguna parte prefieres que la haga yo, la cotizo aparte.",
              "El chatbot de WhatsApp e Instagram, que trabaja Luis Enrique, y la recuperación de tu cuenta de Meta.",
              "Las suscripciones de Lovable, Supabase u otras herramientas.",
              "Cambios en la página actual llegate.net.",
          ])]

# Lo que necesitamos
story += [P("Lo que necesitamos de ti", "h2"),
          P("Para empezar la semana siguiente a tu aprobación:")]
for key, titulo, texto in [
    ("horario", "Horario de las sesiones", "Qué día y hora te queda mejor cada semana."),
    ("lovable", "Lo que ya hiciste", "El enlace a tu proyecto de Lovable, para revisarlo antes de la primera sesión."),
]:
    story.append(KeepTogether([
        check_row(f"listo_{key}", f"Respondido: {titulo}", f"<b>{titulo}.</b> {texto}"),
        Spacer(1, 3),
        answer_field(f"respuesta_{key}", f"Respuesta: {titulo}"),
        Spacer(1, 8),
    ]))
for key, titulo, texto in [
    ("cuentas", "Cuentas", "Tus cuentas de GitHub y Supabase, o las creamos juntos en la sesión de arranque."),
    ("excel", "Tus Excel", "Copia de las planillas de reservas de todos los meses, ingresos, gastos e Inventario "
     "maestro."),
]:
    story.append(check_row(f"enviado_{key}", f"Enviado: {titulo}", f"<b>{titulo}.</b> {texto}"))

# Términos
story += [P("Términos y condiciones", "h2"),
          numbered([
              "<b>Pagos.</b> El arranque se paga al aprobar la propuesta. El acompañamiento se paga por adelantado "
              "al inicio de cada mes.",
              "<b>Duración.</b> Mínimo 3 meses, porque aprender lleva tiempo. Después sigue mes a mes y puedes "
              "terminarlo avisando con 15 días.",
              "<b>Sesiones.</b> Se pueden mover avisando con 24 horas. Las que no se usan en el mes no se acumulan.",
              "<b>Alcance.</b> El acompañamiento es guía y revisión. Si quieres que construya una parte completa, se "
              "cotiza por escrito antes de hacerla.",
              "<b>Acuerdos por escrito.</b> Todo cambio de precio, alcance o fechas se confirma por WhatsApp o "
              "correo.",
              "<b>Propiedad.</b> El proyecto, el código, la base de datos y las cuentas son tuyos desde el primer "
              "día.",
              "<b>Confidencialidad.</b> Tus datos de huéspedes, propietarios y finanzas se usan solo para "
              "acompañarte y no se comparten con nadie.",
              "<b>Validez.</b> Esta propuesta es válida hasta el 25 de noviembre de 2026.",
          ])]

story += comments_and_acceptance(
    "La propuesta queda aprobada con la firma de ambas partes y el pago del arranque.",
    "Por el acompañante", "Alejandro Lamont")

doc.build(story)
print("PDF generado:", SALIDA)
