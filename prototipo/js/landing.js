/* Página para huéspedes: buscador, catálogo y asistente de reservas de demostración. */
(function () {
  const S = window.STORE, D = S.D, fmt = S.fmt;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icons = () => window.lucide && window.lucide.createIcons();
  const WHATSAPP = "584248966650";
  const tarifa = (p, fecha) => { const m = S.toDate(fecha).getMonth(); return [11, 0, 2, 3, 7].includes(m) ? p.alta : p.baja; };

  const AMENIDADES = [["waves", "Piscina"], ["umbrella", "A minutos de la playa"], ["zap", "Planta eléctrica"], ["droplets", "Tanque de agua"],
    ["wifi", "Wifi"], ["car", "Estacionamiento"], ["paw-print", "Algunos aceptan mascotas"], ["sunset", "Vista al mar"], ["message-circle", "Atención por WhatsApp"]];
  $("#amenities").innerHTML = AMENIDADES.map(([i, t]) => `<li><i data-lucide="${i}"></i>${t}</li>`).join("");

  // ---------- Buscador y catálogo ----------
  const busqueda = { llegada: "2026-12-18", salida: "2026-12-21", personas: 4 };
  $("#f-in").value = busqueda.llegada; $("#f-out").value = busqueda.salida;
  $("#f-in").min = $("#f-out").min = D.HOY;
  const persOut = $("#f-pers");
  const setPers = (n) => { busqueda.personas = Math.min(10, Math.max(1, n)); persOut.textContent = busqueda.personas; };
  $("#menos").addEventListener("click", () => { setPers(busqueda.personas - 1); renderGrid(); });
  $("#mas").addEventListener("click", () => { setPers(busqueda.personas + 1); renderGrid(); });
  $("#f-in").addEventListener("change", () => {
    if (S.toDate($("#f-out").value) <= S.toDate($("#f-in").value)) {
      const d = S.toDate($("#f-in").value); d.setDate(d.getDate() + 2); $("#f-out").value = d.toISOString().slice(0, 10);
    }
  });
  $("#buscar").addEventListener("submit", (e) => {
    e.preventDefault();
    busqueda.llegada = $("#f-in").value; busqueda.salida = $("#f-out").value;
    renderGrid();
    $("#catalogo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  let verTodos = false;
  $("#ver-todos").addEventListener("click", () => { verTodos = true; renderGrid(); });

  function renderGrid() {
    const { llegada, salida, personas } = busqueda;
    const n = Math.max(1, S.noches(llegada, salida));
    const lista = D.propiedades.filter((p) => p.cap >= personas)
      .map((p) => ({ p, libre: !S.ocupada(p.id, llegada, salida), precio: tarifa(p, llegada) }))
      .sort((a, b) => b.libre - a.libre || a.precio - b.precio);
    const libres = lista.filter((x) => x.libre).length;
    $("#finder-note").textContent = libres
      ? `${libres} ${libres === 1 ? "apartamento libre" : "apartamentos libres"} del ${fmt.rango(llegada, salida)} para ${personas} ${personas === 1 ? "persona" : "personas"}.`
      : `No queda nada libre para ${personas} personas en esas fechas. Prueba otras o escríbenos.`;
    $("#cat-sub").textContent = `${n} ${n === 1 ? "noche" : "noches"}, ${fmt.rango(llegada, salida)}. Los ocupados aparecen al final.`;
    const visibles = verTodos ? lista : lista.slice(0, 9);
    $("#ver-todos").hidden = verTodos || lista.length <= 9;
    $("#ver-todos").textContent = `Ver los ${lista.length} apartamentos`;
    $("#grid").innerHTML = lista.length ? visibles.map(({ p, libre, precio }) => {
      const c = S.conjunto(p.conjunto);
      return `<article class="apt ${libre ? "" : "busy"}">
        <div class="apt-photo"><img src="${p.foto}" alt="Apartamento ${esc(p.nombre)}" loading="lazy">
          ${libre ? '<span class="tag tag-sea"><i data-lucide="check"></i>Libre en tus fechas</span>' : '<span class="tag tag-plain">Ocupado en esas fechas</span>'}</div>
        <div><h3>${esc(p.nombre)}</h3>
          <div class="apt-meta"><span><i data-lucide="umbrella"></i>${c.min} min a ${c.playa}</span><span><i data-lucide="users"></i>Hasta ${p.cap}</span><span><i data-lucide="bed-double"></i>${p.hab} hab.</span></div></div>
        <div class="apt-row"><span class="price"><b>${fmt.usd(precio)}</b> / noche</span>
          ${libre ? `<button class="btn btn-ghost btn-sm" type="button" data-consultar="${p.id}">Consultar</button>` : ""}</div>
      </article>`;
    }).join("") : `<div class="empty" style="grid-column:1/-1">Ningún apartamento recibe ${personas} personas. Escríbenos y buscamos una opción.</div>`;
    icons();
    document.querySelectorAll("[data-consultar]").forEach((b) => b.addEventListener("click", () => abrirBot(b.dataset.consultar)));
  }
  renderGrid();

  // ---------- Asistente ----------
  const bot = $("#bot"), log = $("#bot-log");
  const conv = { iniciado: false, llegada: null, salida: null, personas: null, presupuesto: null, maxNoche: null, elegido: null, preferida: null, transcript: [] };
  const hora = () => new Date().toTimeString().slice(0, 5);

  function abrirBot(pref) {
    if (pref) conv.preferida = pref;
    bot.classList.add("open"); bot.setAttribute("aria-hidden", "false");
    document.querySelector(".bot-launch").hidden = true;
    if (!conv.iniciado) { conv.iniciado = true; inicio(); }
    else if (pref && !conv.elegido) { yo(`Me interesa ${S.prop(pref).nombre}`); preguntarFechas(); }
  }
  function cerrarBot() {
    bot.classList.remove("open"); bot.setAttribute("aria-hidden", "true");
    document.querySelector(".bot-launch").hidden = false;
  }
  document.querySelectorAll("[data-open-bot]").forEach((b) => b.addEventListener("click", () => abrirBot()));
  $("#bot-close").addEventListener("click", cerrarBot);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && bot.classList.contains("open")) cerrarBot(); });

  const bajar = () => (log.scrollTop = log.scrollHeight);
  function add(html, cls) { const el = document.createElement("div"); el.className = cls; el.innerHTML = html; log.appendChild(el); icons(); bajar(); return el; }
  function yo(texto) { conv.transcript.push({ de: "cliente", texto, hora: hora() }); add(esc(texto), "msg me"); }
  function dice(texto) {
    return new Promise((ok) => {
      const t = add("<i></i><i></i><i></i>", "typing");
      setTimeout(() => { t.remove(); conv.transcript.push({ de: "asistente", texto: texto.replace(/<[^>]+>/g, ""), hora: hora() }); add(texto, "msg bot-msg"); ok(); }, 550 + Math.min(texto.length * 6, 650));
    });
  }
  function opciones(lista) {
    const el = add(lista.map(([t]) => `<button type="button">${esc(t)}</button>`).join(""), "choice");
    el.querySelectorAll("button").forEach((b, i) => b.addEventListener("click", () => { el.remove(); yo(lista[i][0]); lista[i][1](); }));
  }

  async function inicio() {
    await dice("¡Hola! Soy el asistente de Llégate. Te ayudo a encontrar dónde quedarte en Lechería y te paso con la asesora para reservar.");
    if (conv.preferida) { yo(`Me interesa ${S.prop(conv.preferida).nombre}`); }
    await dice(`Veo que estás buscando del <b>${fmt.rango(busqueda.llegada, busqueda.salida)}</b> para <b>${busqueda.personas} personas</b>. ¿Busco con esos datos?`);
    opciones([["Sí, esos datos", () => { Object.assign(conv, { llegada: busqueda.llegada, salida: busqueda.salida, personas: busqueda.personas }); preguntarPresupuesto(); }],
      ["Quiero cambiarlos", preguntarFechas]]);
  }

  async function preguntarFechas() {
    await dice("Cuéntame tus fechas y cuántas personas viajan.");
    const f = add(`<div class="field"><label for="b-in">Llegada</label><input class="input" type="date" id="b-in" value="${busqueda.llegada}" min="${D.HOY}"></div>
      <div class="field"><label for="b-out">Salida</label><input class="input" type="date" id="b-out" value="${busqueda.salida}" min="${D.HOY}"></div>
      <div class="field"><label for="b-pers">Personas</label><input class="input" type="number" id="b-pers" min="1" max="10" value="${busqueda.personas}"></div>
      <button class="btn btn-primary" type="button" style="align-self:end">Continuar</button>`, "inline-form");
    f.querySelector("button").addEventListener("click", () => {
      const a = f.querySelector("#b-in").value, b = f.querySelector("#b-out").value, n = +f.querySelector("#b-pers").value || 1;
      if (!a || !b || S.toDate(b) <= S.toDate(a)) { f.querySelector("#b-out").focus(); return; }
      f.remove();
      Object.assign(conv, { llegada: a, salida: b, personas: n });
      yo(`Del ${fmt.rango(a, b)}, somos ${n}`);
      preguntarPresupuesto();
    });
  }

  async function preguntarPresupuesto() {
    await dice("¿Cuánto quieres gastar por noche, más o menos? Así te muestro lo que mejor encaja.");
    const rangos = [["Hasta $70", 70], ["Entre $70 y $100", 100], ["Entre $100 y $130", 130], ["Más de $130", 999]];
    opciones(rangos.map(([t, max]) => [t, () => { conv.presupuesto = t; conv.maxNoche = max; mostrarOpciones(); }]));
  }

  async function mostrarOpciones() {
    const n = S.noches(conv.llegada, conv.salida);
    let libres = D.propiedades.filter((p) => p.cap >= conv.personas && !S.ocupada(p.id, conv.llegada, conv.salida))
      .map((p) => ({ p, precio: tarifa(p, conv.llegada) }));
    if (!libres.length) {
      await dice(`Para ${conv.personas} personas no me queda nada libre del ${fmt.rango(conv.llegada, conv.salida)}. La asesora puede buscarte alternativas.`);
      return handoffWhatsApp(`Hola! Busco apartamento del ${fmt.rango(conv.llegada, conv.salida)} para ${conv.personas} personas y el asistente no encontró disponibilidad.`);
    }
    let dentro = libres.filter((x) => x.precio <= conv.maxNoche).sort((a, b) => b.precio - a.precio);
    const ajustado = !dentro.length;
    if (ajustado) dentro = libres.sort((a, b) => a.precio - b.precio);
    if (conv.preferida) { const i = dentro.findIndex((x) => x.p.id === conv.preferida); if (i > 0) dentro.unshift(dentro.splice(i, 1)[0]); }
    const top = dentro.slice(0, 3);
    await dice(ajustado
      ? `En ese presupuesto no queda nada libre, pero estas son las ${top.length} opciones más económicas para tus fechas:`
      : `Tengo ${top.length} ${top.length === 1 ? "opción libre" : "opciones libres"} para ${n} noches. Todas con piscina:`);
    top.forEach(({ p, precio }) => {
      const c = S.conjunto(p.conjunto), total = precio * n;
      const el = add(`<img src="${p.foto}" alt=""><div><b>${esc(p.nombre)}</b>
        <span>${c.min} min a ${c.playa} · hasta ${p.cap} personas · ${p.extras.slice(0, 2).join(", ")}</span>
        <span class="total">${fmt.usd(precio)} por noche · ${fmt.usd(total)} en total</span>
        <span>Abono 50 %: ${fmt.usd(total / 2)} · ${fmt.bs(total / 2)}*</span>
        <button class="btn btn-ghost btn-sm" type="button">Me gusta este</button></div>`, "bot-option");
      el.querySelector("button").addEventListener("click", () => elegir(p, precio, total));
    });
    add(`<span style="font-size:12px;color:var(--muted)">*Bolívares a tasa BCV de ejemplo (${D.TASA_BCV} Bs/$). El resto se paga al llegar.</span>`, "choice");
  }

  async function elegir(p, precio, total) {
    if (conv.elegido) return;
    conv.elegido = { p, precio, total };
    log.querySelectorAll(".bot-option button").forEach((b) => (b.disabled = true));
    yo(`Me gusta ${p.nombre}`);
    await dice("¡Buena elección! ¿A nombre de quién hago la solicitud?");
    const f = add(`<div class="field full"><label for="b-nombre">Nombre</label><input class="input" id="b-nombre" placeholder="Nombre y apellido" autocomplete="name"></div>
      <div class="field full"><label for="b-tel">WhatsApp (opcional)</label><input class="input" id="b-tel" inputmode="tel" placeholder="+58 4xx xxx xxxx" autocomplete="tel"></div>
      <button class="btn btn-primary full" type="button">Continuar</button>`, "inline-form");
    f.querySelector("#b-nombre").focus();
    f.querySelector("button").addEventListener("click", () => {
      const nombre = f.querySelector("#b-nombre").value.trim();
      if (!nombre) { f.querySelector("#b-nombre").focus(); return; }
      const tel = f.querySelector("#b-tel").value.trim();
      f.remove(); yo(nombre);
      cerrarSolicitud(nombre, tel);
    });
  }

  async function cerrarSolicitud(nombre, tel) {
    const { p, precio, total } = conv.elegido;
    const n = S.noches(conv.llegada, conv.salida);
    const texto = `Hola Llégate! Soy ${nombre}. Quiero reservar ${p.nombre} del ${fmt.rango(conv.llegada, conv.salida)} (${n} noches) para ${conv.personas} personas. Total ${fmt.usd(total)}, abono ${fmt.usd(total / 2)}.`;
    await dice(`Listo, ${esc(nombre.split(" ")[0])}. Toca el botón y se abre WhatsApp con tu solicitud ya escrita. La asesora te confirma y te envía los datos de pago.`);
    const id = S.agregarLead({
      nombre, telefono: tel, canal: "Asistente web", fase: "nuevo", creado: D.HOY + "T" + hora(),
      llegada: conv.llegada, salida: conv.salida, personas: conv.personas, presupuesto: Math.min(precio, conv.maxNoche === 999 ? precio : conv.maxNoche),
      motivo: "Por confirmar", edad: "", recurrente: false, interes: p.id, opciones: [p.id],
      resumen: `${conv.personas} personas del ${fmt.rango(conv.llegada, conv.salida)} (${n} noches). Presupuesto: ${conv.presupuesto.toLowerCase()} por noche. Eligió ${p.nombre}: ${fmt.usd(total)} en total, abono de ${fmt.usd(total / 2)}. Pidió la solicitud por WhatsApp.`,
      conversacion: conv.transcript.slice(),
    });
    handoffWhatsApp(texto);
    add(`<b>Así le llega a Llégate:</b> esta conversación ya entró al sistema como cliente nuevo, con fechas, personas, presupuesto y el apartamento elegido. <a href="index.html#cliente/${id}">Verla en el sistema</a>`, "handoff");
  }

  function handoffWhatsApp(texto) {
    add(`<a class="btn btn-whatsapp" style="width:100%" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>Enviar solicitud por WhatsApp</a>`, "choice");
  }
})();
