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
               "Para Naylu Vergara, Llégate a Lechería C.A.  ·  Alejandro Lamont  ·  6 de noviembre de 2026",
               author="Alejandro Lamont", subject="Propuesta Fase 1 para Llégate a Lechería C.A.")

story = []

# Resumen
story += [P("Resumen", "h2"),
          P("Te propongo construir el sistema administrativo de Llégate a Lechería por fases. La Fase 1 reúne en un "
            "solo lugar tus reservas, cobros, comisiones y gastos, y los convierte en estadísticas para que puedas "
            "analizar tus números y tomar decisiones."),
          P("Esta versión incorpora lo que pediste al leer la primera: gastos y estadísticas desde la Fase 1. Para "
            "mantener el precio, la agenda del anfitrión y las fichas de ingreso pasan a la Fase 2."),
          bullets([
              "<b>Fase 1:</b> 260 USD en 3 cuotas, entrega el viernes 4 de diciembre de 2026.",
              "<b>Plan mensual:</b> entre 35 y 50 USD desde la entrega, para mantener el sistema funcionando.",
              "<b>Fases 2 y 3:</b> precio estimado de 200 a 260 USD y de 320 a 400 USD. Se cotizan en firme cuando "
              "la fase anterior esté funcionando.",
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
            "especiales sin depender del programador y que todo quede integrado en un solo lugar."),
          P("También pediste que el sistema no se quede en registrar: que procese esos datos y te muestre qué "
            "propiedades rinden más, cuáles no rotan y cómo vas frente a meses y años anteriores.")]

# Fase 1
story += [P("Fase 1: alcance", "h2"),
          P("La Fase 1 entrega un sistema web, usable desde el celular y la computadora, que reemplaza al bot de "
            "Telegram \"Producción\" y a los Excel de reservas, ingresos y gastos."),
          KeepTogether([P("Registro y cobros", "h3"), numbered([
              "<b>Registro de reservas.</b> Cliente, propiedad, fechas, noches, número de personas, canal de origen, "
              "estado de procedencia, red social, motivo del viaje, rango de edad y si es cliente recurrente.",
              "<b>Control de cobros.</b> Abono del 50% al reservar y saldo al llegar, con el método de pago de cada "
              "uno: pago móvil, transferencia nacional, Zelle, Binance/USDT o efectivo. Cada reserva muestra si está "
              "pagada, abonada o pendiente.",
              "<b>Ajustes manuales.</b> Puedes corregir cualquier reserva sin programador: todo cobrado en la "
              "reserva, descuentos negociados, cambios de fecha y estadías sin cobro.",
              "<b>Comisiones por temporada.</b> Porcentaje de temporada baja y alta que tú configuras, con las "
              "fechas de cada temporada.",
              "<b>Comisiones por referido.</b> Qué propiedad trajo cada referido y el total de comisión que le "
              "corresponde.",
              "<b>Liquidaciones.</b> El sistema calcula, por reserva y por mes, cuánto corresponde a cada "
              "propietario o anfitrión y cuánto a Llégate.",
              "<b>Gastos de la empresa.</b> Registro por categoría y por mes, para ver ingresos y salidas juntos.",
              "<b>Recordatorios de cobro.</b> Notificación en el celular de los saldos pendientes y de las llegadas "
              "y salidas del día siguiente.",
              "<b>Cotizaciones en PDF.</b> La asesora rellena los datos y el sistema genera la cotización con la "
              "marca de Llégate, lista para enviar.",
          ])]),
          Spacer(1, 6),
          KeepTogether([P("Estadísticas", "h3"), numbered([
              "<b>Resumen del mes.</b> Ingresos, comisiones, gastos, ganancia neta, saldos por cobrar y liquidaciones "
              "pendientes, con el avance frente a tu meta de ventas del mes.",
              "<b>Detalle por propiedad.</b> Ingreso y ganancia de cada propiedad, ordenados de mayor a menor, y "
              "noches vendidas calculadas con el check-in y el check-out.",
              "<b>Rotación.</b> Las propiedades más alquiladas del mes y del año, y las que llevan más tiempo sin "
              "alquilarse.",
              "<b>Cobros y pagos.</b> Ingreso pendiente y lo pagado a cada propietario tal como lo registras, y "
              "reparto de lo cobrado por método de pago.",
              "<b>Histórico y comparaciones.</b> Una línea de tiempo mes a mes con el histórico de tus Excel, "
              "comparada con el mes anterior y con el mismo mes del año pasado, con filtros por mes, propiedad y "
              "método de pago.",
          ], start=10)]),
          Spacer(1, 6),
          KeepTogether([P("Base del sistema", "h3"), numbered([
              "<b>Accesos por persona.</b> Cuentas para ti y para la asesora. La asesora no ve los gastos, las "
              "ganancias ni las estadísticas financieras.",
              "<b>Respaldo en tiempo real.</b> Cada cambio se copia al Google Sheets de Llégate, que sigue siendo la "
              "base madre de datos.",
              "<b>Migración.</b> Carga de las propiedades, las reservas activas y el histórico de tus Excel mensuales.",
              "<b>Capacitación.</b> Una sesión por videollamada para ti y la asesora, y una guía corta de uso.",
          ], start=15)]),
          Spacer(1, 6),
          P("Los montos se registran en la moneda que confirmes, con su equivalente en bolívares a la tasa que uses."),
          Spacer(1, 4),
          KeepTogether(labeled_field("¿Quieres cambiar, quitar o añadir algo de la Fase 1? Escríbelo aquí:",
                                     "cambios_fase1", CW, 54, multiline=True))]

# Qué no incluye
story += [P("Qué no incluye la Fase 1", "h2"),
          P("Lo siguiente queda fuera de la Fase 1 y, si lo quieres, se cotiza aparte:"),
          bullets([
              "Avisos por WhatsApp. En la Fase 1 los avisos llegan como notificación en el celular, porque la cuenta "
              "de Meta de Llégate tiene hoy restringido el uso de números de WhatsApp.",
              "Agenda del anfitrión, fichas de ingreso, seguimiento posventa, reseñas, captación de propiedades y "
              "botón de la asesora en la web (Fase 2).",
              "Portal del propietario, cartera única de propiedades, catálogo web con disponibilidad, lectura "
              "automática de cédula y placa, y estadísticas de clientes potenciales de WhatsApp (Fase 3).",
              "El chatbot de WhatsApp e Instagram y la solución de la restricción de la cuenta de Meta.",
              "Cambios en la página web actual llegate.net.",
              "Fotografía, video o redacción de textos de las propiedades.",
              "Pagos en línea dentro del sistema.",
          ])]

# Plazos
story += [KeepTogether([
              P("Plazos", "h2"),
              P("La Fase 1 se entrega el viernes 4 de diciembre de 2026, siempre que la propuesta se apruebe y el "
                "primer pago se haga antes del viernes 13 de noviembre."),
              numbered([
              "<b>Del 9 al 13 de noviembre.</b> Aprobación, primer pago, respuestas a las preguntas pendientes y "
              "entrega de accesos y de los Excel actuales e históricos.",
              "<b>Del 16 al 21 de noviembre.</b> Estructura de datos, registro de reservas, control de cobros y "
              "gastos.",
              "<b>Del 23 al 28 de noviembre.</b> Comisiones, referidos, liquidaciones, cotizaciones en PDF, "
              "notificaciones, respaldo en Google Sheets y migración del histórico.",
              "<b>Del 30 de noviembre al 4 de diciembre.</b> Estadísticas, pruebas con datos reales junto contigo y "
              "la asesora, capacitación y entrega.",
          ]),
              Spacer(1, 6),
              P("Durante las pruebas el bot de Telegram sigue activo. Se apaga cuando confirmes que el sistema "
                "registra bien las reservas reales.")])]

# Inversión
rows = [[P("Cuota", "cellh"), P("Monto", "cellh"), P("Cuándo se paga", "cellh")]] + [
    [P(a, "cell"), P(f"<b>{b}</b>", "cell"), P(c, "cell")] for a, b, c in [
        ("1", "100 USD", "Al aprobar la propuesta, antes del 13 de noviembre"),
        ("2", "80 USD", "Al mostrar el registro de reservas, cobros y gastos funcionando, el 21 de noviembre"),
        ("3", "80 USD", "En la entrega, el 4 de diciembre"),
    ]] + [[P("<b>Total</b>", "cell"), P("<b>260 USD</b>", "cell"), P("", "cell")]]
story += [KeepTogether([
    P("Inversión", "h2"),
    P("La Fase 1 cuesta 260 USD, pagados en 3 cuotas ligadas a avances visibles."),
    table(rows, [CW * 0.14, CW * 0.2, CW * 0.66]), Spacer(1, 8),
    P("Desde la entrega empieza el plan mensual, de entre 35 y 50 USD. Cubre el alojamiento del sistema, la base "
      "de datos, las notificaciones, las copias de seguridad, la corrección de fallos y el soporte por WhatsApp. El "
      "monto exacto se fija por escrito antes de la entrega, dentro de ese rango, según los servicios que el sistema "
      "use."),
])]

# Fases siguientes
fases = [
    ("2", "Agenda del anfitrión: llegadas y salidas de la semana para coordinar la entrega de llaves"),
    ("2", "Fichas de ingreso para vigilancia, generadas en PDF desde la reserva"),
    ("2", "Seguimiento posventa del anfitrión: contacto durante la estadía, encuestas y material POP"),
    ("2", "Reseñas: solicitud al día siguiente de la salida, tu aprobación y muro en la web"),
    ("2", "Captación de propiedades: checklist de visita, propuesta enviada y texto de venta"),
    ("2", "Botón \"habla con la asesora\" y formulario de atención en la web"),
    ("3", "Portal del propietario: fechas, ingresos, reporte mensual y actualización de precios"),
    ("3", "Cartera única de propiedades, en lugar de Notion y el Inventario maestro"),
    ("3", "Catálogo web con disponibilidad leída de los calendarios de Airbnb"),
    ("3", "Lectura automática de cédula y placa para las fichas de ingreso"),
    ("3", "Estadísticas de clientes potenciales de WhatsApp e Instagram, cuando el número de WhatsApp esté resuelto"),
]
rows = [[P("Fase", "cellh"), P("Qué incluye", "cellh"), P("Cotizar ya", "cellh")]] + [
    [P(f, "cell"), P(q, "cell"), Check(f"cotizar_{i}", f"Quiero que me lo coticen: {q}")]
    for i, (f, q) in enumerate(fases, 1)]
precios = [[P("Fase", "cellh"), P("Precio estimado", "cellh"), P("Cuándo", "cellh")]] + [
    [P(a, "cell"), P(f"<b>{b}</b>", "cell"), P(c, "cell")] for a, b, c in [
        ("2", "200 a 260 USD", "Al cerrar la Fase 1, a inicios de 2027"),
        ("3", "320 a 400 USD", "Al cerrar la Fase 2"),
    ]]
story += [P("Fases siguientes", "h2"),
          P("Las Fases 2 y 3 completan el resto de módulos que pediste. Cada una se cotiza en firme y se aprueba por "
            "separado, cuando la anterior esté funcionando. Marca lo que quieras que te cotice desde ya."),
          table(rows, [CW * 0.09, CW * 0.77, CW * 0.14]), Spacer(1, 10),
          KeepTogether([
              P("Para que puedas planificar, este es el precio estimado de cada fase:"),
              table(precios, [CW * 0.09, CW * 0.25, CW * 0.66]), Spacer(1, 8),
              P("El precio final depende de lo que cambie al terminar la fase anterior. Con la Fase 3 el plan mensual "
                "puede subir si se activan servicios con costo, como la lectura con IA; se avisará antes."),
          ])]

# Chatbot
story += [P("Chatbot: servicio aparte", "h2"),
          P("El chatbot de WhatsApp e Instagram no forma parte de esta propuesta. Lo cotiza y lo desarrolla Luis "
            "Enrique por separado, a partir de tus respuestas a su cuestionario."),
          P("Si contratas ambos servicios, el sistema de la Fase 1 queda preparado para conectarse con el chatbot más "
            "adelante, por ejemplo para leer la disponibilidad o registrar reservas.")]

# Lo que necesitamos
story += [P("Lo que necesitamos de Llégate", "h2"),
          P("Para cumplir la fecha del 4 de diciembre necesitamos lo siguiente antes del 13 de noviembre.")]
preguntas = [
    ("moneda", "Moneda y tasa", "En qué moneda llevas las cuentas, dólares o euros, y qué tasa usas para los pagos "
     "en bolívares."),
    ("comisiones", "Comisiones", "El porcentaje de temporada baja y el de temporada alta, y las fechas de cada "
     "temporada."),
    ("flujo", "Flujo del dinero", "Quién recibe el 50% de la reserva, quién recibe el saldo, cuándo se paga al "
     "propietario o anfitrión y qué significa \"pagado al cliente\" en tus planillas."),
    ("referidos", "Referidos", "Quiénes son los referidos, sobre qué cobran comisión y cuánto."),
    ("ganancia", "Ganancia por propiedad", "Si la ganancia que quieres ver por propiedad es la comisión de Llégate o "
     "lo que recibe el propietario."),
    ("historico", "Histórico", "Cuántos meses o años de Excel hay y si todas las pestañas tienen las mismas "
     "columnas."),
    ("meta", "Meta de ventas", "Tu meta de ventas mensual, si quieres que el resumen del mes muestre el avance."),
]
for key, titulo, texto in preguntas:
    story.append(KeepTogether([
        check_row(f"listo_{key}", f"Respondido: {titulo}", f"<b>{titulo}.</b> {texto}"),
        Spacer(1, 3),
        answer_field(f"respuesta_{key}", f"Respuesta: {titulo}"),
        Spacer(1, 8),
    ]))
entregas = [
    ("archivos", "Archivos actuales", "Copia de los Excel de reservas de todos los meses, de ingresos, de gastos y del "
     "Inventario maestro."),
    ("google", "Google Sheets de respaldo", "Una cuenta de Google de Llégate donde vivirá la base madre."),
    ("usuarios", "Usuarios", "Tu nombre y correo, y los de la asesora."),
    ("marca", "Marca", "Logo en buena calidad para las cotizaciones en PDF."),
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
              "<b>Validez.</b> Esta propuesta es válida hasta el 13 de noviembre de 2026. Si se aprueba después, las "
              "fechas se recalculan.",
          ])]

# Comentarios y aceptación
story += comments_and_acceptance(
    "La propuesta queda aprobada con la firma de ambas partes y el pago de la primera cuota.",
    "Por el desarrollador", "Alejandro Lamont")

doc.build(story)
print("PDF generado:", SALIDA)
