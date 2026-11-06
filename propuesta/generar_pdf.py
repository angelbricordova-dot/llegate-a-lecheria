"""Genera el PDF rellenable de la propuesta para Llégate a Lechería.

Uso: python3 propuesta/generar_pdf.py <logo.png> <salida.pdf>
"""
import sys

from reportlab.platypus import KeepTogether, Spacer

from pdf_base import (
    CW, Check, P, answer_field, bullets, check_row, comments_and_acceptance, labeled_field, make_doc, numbered,
    table,
)

LOGO, SALIDA = sys.argv[1], sys.argv[2]

doc = make_doc(SALIDA, LOGO, "Sistema administrativo para Llégate a Lechería",
               "Para Naylu Vergara, Llégate a Lechería C.A.  ·  Alejandro Lamont  ·  2 de noviembre de 2026",
               author="Alejandro Lamont", subject="Propuesta Fase 1 para Llégate a Lechería C.A.")

story = []

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
            "cuando la anterior esté funcionando. Marca lo que quieras que te cotice desde ya."),
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
          P("Para cumplir la fecha del 27 de noviembre necesitamos lo siguiente antes del 6 de noviembre.")]
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
        check_row(f"listo_{key}", f"Respondido: {titulo}", f"<b>{titulo}.</b> {texto}"),
        Spacer(1, 3),
        answer_field(f"respuesta_{key}", f"Respuesta: {titulo}"),
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
    story.append(check_row(f"enviado_{key}", f"Enviado: {titulo}", f"<b>{titulo}.</b> {texto}"))

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
story += comments_and_acceptance(
    "La propuesta queda aprobada con la firma de ambas partes y el pago de la primera cuota.",
    "Por el desarrollador", "Alejandro Lamont")

doc.build(story)
print("PDF generado:", SALIDA)
