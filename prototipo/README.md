# Prototipo · Llégate a Lechería

Bocetos navegables para mostrarle a Naylu. Sitio estático: HTML, CSS y JavaScript, sin paso de compilación.

| Página | Qué muestra |
|---|---|
| `landing.html` | La página para huéspedes: buscador de fechas, apartamentos libres y el asistente de reservas |
| `index.html#clientes` | CRM: clientes por fase (Nuevo → Calificado → Cotizado → Reservado / Perdido) |
| `index.html#cliente/L101` | Ficha de un cliente con lo que dejó el asistente y su conversación |
| `index.html#reservas` | Reservas y cobros: abonos, saldos, pagos y ajustes |
| `index.html#estadisticas` | Estadísticas inspiradas en su informe del corte Q3 |

Los datos son de ejemplo (personas inventadas; los conjuntos son los reales). Lo que se cambie se guarda solo en el navegador de quien lo usa; "Restablecer ejemplo" lo deja como al principio.

**Demostración clave:** en `landing.html`, completa el asistente ("¿Te ayudo a elegir?"). Al final aparece "Verla en el sistema", que abre esa misma conversación como cliente nuevo en el CRM.

## Publicarlo en Vercel

1. En vercel.com → **Add New… → Project** → importa el repo `llegate-a-lecheria`.
2. **Root Directory:** `prototipo`. **Framework Preset:** Other. Sin comando de build.
3. **Deploy.** Para que la portada sea la landing, comparte `https://<tu-proyecto>.vercel.app/landing`; el sistema está en `/`.

Con la CLI: `npx vercel deploy prototipo --prod`.

## Tipografías

- Sistema: Bricolage Grotesque y Onest (Google Fonts), como Tu Día en Tucacas.
- Landing: Montserrat (Google Fonts), y Albra Book y Spongeboy cargadas desde llegate.net.
  **Ojo:** llegate.net usa una versión TRIAL de Albra Book, que no permite uso comercial. Para la web final hay que comprar la licencia o cambiarla.
