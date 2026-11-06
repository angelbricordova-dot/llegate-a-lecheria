"""Genera el PDF rellenable de la propuesta del asistente de reservas (Luis Enrique).

Uso: python3 propuesta/generar_pdf_chatbot.py <logo.png> <salida.pdf>
"""
import sys

from reportlab.platypus import KeepTogether, Spacer

from pdf_base import (
    CW, P, answer_field, bullets, check_row, comments_and_acceptance, make_doc, numbered, table,
)

LOGO, SALIDA = sys.argv[1], sys.argv[2]

doc = make_doc(SALIDA, LOGO, "Asistente de reservas para Llégate a Lechería",
               "Para Naylu Vergara, Llégate a Lechería C.A.  ·  Luis Enrique  ·  6 de noviembre de 2026",
               author="Luis Enrique", subject="Propuesta del asistente de reservas para Llégate a Lechería C.A.")

story = []

# Resumen
story += [P("Resumen", "h2"),
          P("Te propongo un asistente de reservas que atiende a tus clientes a toda hora, les muestra solo lo que está "
            "libre y te pasa cada solicitud por WhatsApp, lista para que tú o tu asesora la confirmen."),
          bullets([
              "<b>Instalación:</b> 200 USD en 2 pagos. El segundo solo cuando lleve una semana funcionando.",
              "<b>Mensualidad:</b> 49 USD, todo incluido: inteligencia artificial, servidor y soporte.",
              "<b>Sin permanencia.</b> Pagando el año adelantado, 12 meses por el precio de 9.",
          ])]

# Qué hace
story += [P("Qué hace", "h2"),
          numbered([
              "<b>Atiende 24/7, domingos incluidos,</b> desde un enlace con tu marca: en tu Instagram, tu página de "
              "enlaces y las respuestas automáticas de tu WhatsApp Business (bienvenida y fuera de horario), que te "
              "dejamos configuradas.",
              "<b>Conversa como una persona,</b> en español o inglés: apartamentos, complejos, playas cercanas, "
              "estacionamiento, mascotas, horarios, embarcaciones, estadías corporativas y recomendaciones de "
              "Lechería.",
              "<b>Consulta las fechas libres</b> en tu calendario y el precio de cada temporada. Solo ofrece lo que "
              "está libre.",
              "<b>Busca por fechas, personas, presupuesto y cercanía a la playa,</b> y muestra 2 o 3 opciones con "
              "fotos, precio por noche, total y abono del 50 %, en dólares y bolívares a tasa BCV.",
              "<b>Recoge los datos de la reserva:</b> nombre, fechas, personas, apartamento elegido y peticiones "
              "especiales.",
              "<b>Te pasa la solicitud por WhatsApp.</b> Al final, el cliente toca un botón y se abre tu WhatsApp con "
              "su solicitud ya escrita. Desde ahí, tú o tu asesora confirman, envían los datos de pago y reciben el "
              "comprobante.",
              "<b>Te pasa al cliente cuando lo pide.</b> Si quiere hablar con una persona, les llega por WhatsApp con "
              "lo que ya conversó.",
              "<b>No ofrece dos veces las mismas fechas.</b> Mientras confirman una solicitud, esas fechas no se le "
              "ofrecen a otro cliente.",
              "<b>Te avisa por correo</b> a ti y a tu asesora de cada solicitud.",
              "<b>Informe mensual:</b> consultas, cuántas de noche o en domingo, solicitudes recibidas y apartamentos "
              "y fechas más pedidos.",
          ])]

# Precio
rows = [[P("Concepto", "cellh"), P("Monto", "cellh"), P("Cuándo se paga", "cellh")]] + [
    [P(a, "cell"), P(f"<b>{b}</b>", "cell"), P(c, "cell")] for a, b, c in [
        ("Instalación, pago 1", "100 USD", "Al empezar"),
        ("Instalación, pago 2", "100 USD", "Cuando lleve una semana funcionando"),
        ("Mensualidad", "49 USD", "Cada mes"),
        ("Plan anual (opcional)", "441 USD", "Por adelantado: 12 meses por el precio de 9, en lugar de 588 USD"),
    ]]
story += [KeepTogether([
    P("Precio", "h2"),
    P("La instalación cuesta 200 USD. El segundo pago se hace cuando el asistente lleve una semana funcionando, para "
      "que tengas la certeza de que funciona antes de completarlo."),
    table(rows, [CW * 0.3, CW * 0.16, CW * 0.54]), Spacer(1, 8),
    P("La mensualidad es todo incluido: inteligencia artificial, servidor y soporte. No pagas nada a nadie más. "
      "No hay permanencia."),
    P("Marca cómo prefieres pagar la mensualidad:"),
    check_row("plan_mensual", "Prefiero el plan mensual", "Mensual, 49 USD cada mes"),
    Spacer(1, 4),
    check_row("plan_anual", "Prefiero el plan anual", "Anual, 441 USD por adelantado"),
])]

# Mensualidad
story += [P("La mensualidad incluye", "h2"),
          bullets([
              "Vigilancia del asistente.",
              "Cambios en lo que responde: precios, temporadas, apartamentos nuevos y reglas.",
              "Copias de seguridad.",
              "El informe mensual.",
              "Soporte por WhatsApp.",
          ]),
          Spacer(1, 4),
          P("Las funciones nuevas se cotizan aparte.")]

# Garantía
story += [P("Garantía", "h2"),
          bullets([
              "Respondemos cualquier aviso en menos de 24 horas, todos los días.",
              "Los errores del asistente se corrigen sin costo y sin límite, las veces que haga falta.",
              "Si queda sin funcionar más de 24 horas por una falla nuestra, los días sin servicio no se cobran.",
              "El segundo pago de la instalación solo se hace cuando lleva una semana funcionando.",
          ])]

# Lo que necesitamos
story += [P("Lo que necesitamos de ti", "h2"),
          check_row("enviado_apartamentos", "Enviado: lista de apartamentos",
                    "<b>La lista de apartamentos:</b> nombre, complejo, capacidad, precio en temporada baja y alta, "
                    "cercanía a la playa y fotos."),
          Spacer(1, 4),
          KeepTogether([
              check_row("listo_fechas", "Respondido: dónde llevas las fechas ocupadas",
                        "<b>Dónde llevas hoy las fechas ocupadas.</b> Si es a mano, te dejamos una hoja sencilla."),
              Spacer(1, 3),
              answer_field("respuesta_fechas", "Respuesta: dónde llevas hoy las fechas ocupadas"),
              Spacer(1, 8),
          ]),
          check_row("enviado_respuestas", "Enviado: respuestas frecuentes",
                    "<b>Las respuestas que das siempre:</b> estacionamiento, mascotas, horarios, depósito, etc.")]

# Comentarios y aceptación
story += comments_and_acceptance(
    "La propuesta queda aprobada con la firma de ambas partes y el primer pago de la instalación.",
    "Por el desarrollador", "Luis Enrique")

doc.build(story)
print("PDF generado:", SALIDA)
