# Brief: video de demostración del sistema de Llégate a Lechería

Contexto completo para producir un video vertical que le presenta a Naylu Vergara, dueña de Llégate a Lechería, el sistema que le estamos proponiendo. Debe seguir el formato del video de referencia de Carbono Barber's (adjunto aparte).

## 1. Qué es y para quién

- **Cliente:** Llégate a Lechería C.A., agencia de alquiler vacacional en Lechería (Anzoátegui, Venezuela). Maneja unos 40 apartamentos de distintos propietarios, agrupados en conjuntos (Thai, Puerto Morro, Marina del Rey, Doral Beach…). Vende por Instagram, TikTok y WhatsApp.
- **Quien lo ve:** Naylu Vergara, la dueña. Hay que hablarle de **tú**, en tono cercano, venezolano neutro, sin tecnicismos.
- **Quienes lo presentan:** Alejandro Lamont (página, CRM y sistema administrativo) y Luis Enrique (asistente de reservas, el chatbot).
- **Objetivo:** que Naylu vea en 2 minutos cómo funciona todo junto antes de la temporada alta de diciembre y enero, y quiera ver la presentación completa y reunirse.
- **Lo que más le importa** (dicho por ella): ver cómo le llega la información que deja el chatbot; centralizar todo; leer sus números (qué conjuntos rinden, cuáles no rotan, comparación con meses y años anteriores); no depender de un programador para corregir casos especiales; que el Excel siga siendo la "base madre".

## 2. Formato (igual que la referencia de Carbono)

- **Vertical 1080 × 1920, 30 fps, unos 2:00 a 2:10.**
- **Voz en off** en español, una sola voz, ritmo tranquilo, con **subtítulos quemados** abajo, frase por frase, como en la referencia.
- **Cada escena** tiene:
  - Arriba, una **tarjeta de encabezado**: una etiqueta pequeña con punto de color (la sección, por ejemplo "Tu página") y debajo un título corto (por ejemplo "Lo que está libre").
  - En el centro, una **pantalla real del sistema**: captura de teléfono, o de laptop en las escenas de escritorio, recortada y con un acercamiento lento hacia el elemento clave.
  - Ese elemento clave va **resaltado con un borde de color** y una **etiqueta tipo píldora** (fondo oscuro, punto amarillo, texto blanco) que lo nombra.
- **Transiciones** suaves: deslizamiento o fundido corto. Nada de efectos llamativos.
- **Música** alegre y suave, de playa, por debajo de la voz.
- **Cierre:** logo, nombre, una laptop con la presentación, botón "Mira la presentación" con la dirección y los créditos, igual que el final de Carbono.

## 3. Marca

| Uso | Valor |
|---|---|
| Turquesa (principal) | `#00607F` |
| Turquesa profundo (fondos oscuros) | `#032F3E` |
| Amarillo sol (acentos, bordes de resalte, puntos) | `#FFC66E` |
| Verde agua | `#65BBB0` |
| Tinta (texto) | `#1A2B3C` |
| Fondo claro | `#F3F6F5` |

- **Títulos:** Albra Book. Archivos: `https://llegate.net/fonts/AlbraBookTRIAL-Regular.otf` y `…-Medium.otf`. **Es una versión de prueba (TRIAL):** para un video que se publique hay que licenciarla o usar una alternativa serif parecida.
- **Palabras destacadas:** Spongeboy, en amarillo, como "Lechería" en la portada. Archivo: `https://llegate.net/fonts/Spongeboy%20Me%20Bob.ttf`.
- **Texto y subtítulos:** Montserrat (Google Fonts).
- **Logo** (PNG con transparencia): `https://llegate-a-lecheria-prototipo.vercel.app/assets/logo.png`.
- **Estilo del resalte:** borde amarillo `#FFC66E` de 4 px con esquinas redondeadas alrededor del elemento. Píldora `#1A2B3C` con punto `#FFC66E` y texto blanco en Montserrat SemiBold.

## 4. Material disponible

**Páginas en vivo**, para grabar la pantalla si hace falta movimiento real (scroll, toques, el asistente escribiendo):

- Presentación completa: https://llegate-a-lecheria-prototipo.vercel.app/presentacion/
- Página para huéspedes con el asistente: https://llegate-a-lecheria-prototipo.vercel.app/landing
- Sistema (CRM): https://llegate-a-lecheria-prototipo.vercel.app/
- Ficha de un cliente: https://llegate-a-lecheria-prototipo.vercel.app/#cliente/L101
- Reservas y cobros: https://llegate-a-lecheria-prototipo.vercel.app/#reservas
- Estadísticas: https://llegate-a-lecheria-prototipo.vercel.app/#estadisticas

**Para grabar el asistente:** abre la landing en tamaño teléfono (390 × 844) → "¿Te ayudo a elegir?" → "Sí, esos datos" → "Entre $100 y $130" → "Me gusta este" en la primera opción → nombre "Mariana Gómez" → Continuar. Al final aparece el botón verde de WhatsApp y el enlace "Verla en el sistema", que abre esa misma clienta en el CRM. Si algo se ensucia, el botón "Restablecer ejemplo" del sistema deja los datos como al principio.

**Capturas listas**, nítidas a 2× (teléfono 780 × 1688 px; laptop 2160 × 1350 px). Base: `https://llegate-a-lecheria-prototipo.vercel.app/presentacion/img/`

| Archivo | Qué muestra |
|---|---|
| `m-landing.jpg` | Portada de la página en el teléfono ("Vive Lechería como nunca antes") |
| `m-buscador.jpg` | Buscador "¿Cuándo vienes?" con "19 apartamentos libres…" |
| `m-catalogo.jpg` | Apartamentos libres con foto, minutos a la playa y precio |
| `m-bot-hola.jpg` | El asistente saluda y propone las fechas |
| `m-bot-opciones.jpg` | Tres opciones con total, abono 50 % en $ y Bs |
| `m-bot-whatsapp.jpg` | Botón "Enviar solicitud por WhatsApp" y aviso de que entró al sistema |
| `m-ficha-nueva.jpg` | La clienta creada por el asistente, ya en el sistema |
| `m-clientes.jpg` | CRM en el teléfono, columna "Nuevo" |
| `m-ficha.jpg` | Ficha: "Lo que dejó el asistente" |
| `m-conversacion.jpg` | Conversación completa con el asistente |
| `m-reservas.jpg` | Reservas y cobros en el teléfono |
| `m-estadisticas.jpg`, `m-estadisticas-2.jpg` | Estadísticas en el teléfono |
| `d-landing.jpg` | Página en laptop |
| `d-clientes.jpg` | CRM en laptop: tablero por fases |
| `d-ficha.jpg` | Ficha en laptop |
| `d-registrar-reserva.jpg` | Panel "Registrar reserva" con abono, saldo y ganancia |
| `d-reservas.jpg` | Tabla de reservas y cobros |
| `d-reserva-pago.jpg` | Panel de una reserva: pagos, ajustes, lo del propietario |
| `d-estadisticas.jpg`, `d-estadisticas-2.jpg` | Estadísticas en laptop |
| `foto-piscina.jpg`, `foto-playa.jpg`, `foto-atardecer.jpg` | Fotos de ambiente (de banco de imágenes, no de sus apartamentos) |

## 5. Guion escena por escena

Duraciones aproximadas; ajústalas a la voz. Los textos de "Etiqueta" y "Título" van en la tarjeta de arriba.

| # | Tiempo | Etiqueta / Título | Voz en off | Pantalla y resalte |
|---|---|---|---|---|
| 1 | 0:00–0:09 | Llégate a Lechería / Tu sistema, listo para la temporada | Hola, Naylu. Este es el sistema de Llégate a Lechería. Tus huéspedes ven lo que está libre, el asistente los atiende y tú lo ves todo en un solo lugar. | `m-landing.jpg` entero, acercamiento lento. Píldora: "Tu página" |
| 2 | 0:09–0:20 | Instagram / De tu biografía a tu página | Empieza en tu Instagram. El enlace de tu biografía lleva directo a tu página, y quien visita tu perfil ve ahí mismo lo que está libre. | `m-landing.jpg`, resaltar el botón "Buscar fechas". Píldora: "El enlace de tu biografía" |
| 3 | 0:20–0:27 | Anuncios / El mismo enlace, en todas partes | El mismo enlace va en tus historias, en TikTok y en tus anuncios de Meta. | `m-landing.jpg` con leve zoom out. Píldora: "Historias · TikTok · Anuncios" |
| 4 | 0:27–0:38 | Tu página / Lo que está libre | ¿Cuándo vienes? El huésped elige fechas y personas, y solo ve los apartamentos libres. | `m-buscador.jpg`, resaltar "19 apartamentos libres…". Píldora: "Solo lo libre" |
| 5 | 0:38–0:46 | Apartamentos / Con su precio de temporada | Cada uno con fotos, capacidad, minutos a la playa y el precio de la temporada, sujeto a cambios. | `m-catalogo.jpg`, resaltar la etiqueta "Libre en tus fechas" y el precio. Píldora: "Precio de temporada" |
| 6 | 0:46–0:53 | Asistente / De noche y en domingo | Si tiene dudas, el asistente responde al momento, también de noche y en domingo. | `m-bot-hola.jpg`, resaltar la burbuja de saludo. Píldora: "Responde al momento" |
| 7 | 0:53–1:04 | Asistente / Dos o tres opciones | Pregunta fechas, personas y presupuesto, y muestra dos o tres opciones con el total y el abono del cincuenta por ciento, en dólares y en bolívares. | `m-bot-opciones.jpg`, resaltar la línea "Abono 50 %". Píldora: "Total y abono, en $ y Bs" |
| 8 | 1:04–1:11 | Asistente / A tu WhatsApp | Al final, un botón abre tu WhatsApp con la solicitud ya escrita. | `m-bot-whatsapp.jpg`, resaltar el botón verde. Píldora: "La solicitud, ya escrita" |
| 9 | 1:11–1:21 | Tus clientes / Cada uno en su fase | Y esa conversación entra sola a tus clientes, en su fase: nuevo, calificado, cotizado, reservado o perdido. | `d-clientes.jpg` dentro de una laptop, resaltar la tarjeta "Mariana Gómez" en "Nuevo". Píldora: "Lo dejó el asistente" |
| 10 | 1:21–1:30 | Su ficha / Sin volver a preguntar | En su ficha está lo que dejó el asistente: quiénes vienen, qué buscan y qué les gustó. | `m-ficha.jpg`, resaltar el bloque "Lo que dejó el asistente". Píldora: "Resumen del asistente" |
| 11 | 1:30–1:38 | Reservas / Con un botón | Con un botón queda la reserva, con el abono y el saldo al llegar. | `d-registrar-reserva.jpg`, resaltar el recuadro de abono y saldo. Píldora: "Abono y saldo" |
| 12 | 1:38–1:47 | Cobros / Sin programador | Lo que no encaja se corrige sin programador, y cada reserva calcula lo que le toca al propietario y lo que gana Llégate. | `d-reserva-pago.jpg`, resaltar "Ganancia Llégate" y "Para el propietario". Píldora: "Lo de cada quien" |
| 13 | 1:47–1:57 | Tus números / Leídos por ti | Y tus números, leídos por ti: el mes contra el anterior y contra el año pasado, tu meta, y los conjuntos que llevan tiempo sin alquilarse. | `d-estadisticas.jpg`, resaltar "Para echarle un ojo". Píldora: "Conjuntos que no rotan" |
| 14 | 1:57–2:02 | Tu Excel / La base madre | Todo se copia al momento a tu Excel, que sigue siendo tu base madre. | Captura de la sección "Tu Excel sigue siendo la base madre" de la presentación. Píldora: "Copiado al momento" |
| 15 | 2:02–2:12 | (cierre, sin tarjeta) | Llégate a Lechería, lista para la temporada alta. Mira la presentación completa en esta dirección, y el sistema te lo enseñamos en persona. | Logo, "Llégate a Lechería", laptop con `d-landing.jpg`, botón "Mira la presentación" y la dirección **llegate-a-lecheria-prototipo.vercel.app/presentacion**. Abajo: "Hecho por Alejandro Lamont y Luis Enrique" |

## 6. Cuidados

- **Los datos son de ejemplo.** Los nombres de clientes y propietarios son inventados y las cifras no son las de Naylu. Que la voz no diga "tus ventas fueron…": habla de lo que el sistema muestra.
- **Las fotos de apartamentos son de banco de imágenes**, no de sus propiedades.
- **No prometer fechas ni precios** en el video. Eso va en las propuestas aparte.
- **El asistente es de Luis Enrique y el resto de Alejandro**, pero en el video se presenta como un solo sistema; el crédito va al final.
- **WhatsApp:** la cuenta de Meta de Llégate tiene hoy restringidos los números. El video muestra el botón que abre WhatsApp con el mensaje escrito, que funciona igual; no hay que mencionar la restricción.
