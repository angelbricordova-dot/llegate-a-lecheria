/* Sistema interno del prototipo: clientes (CRM), ficha, reservas y cobros, estadísticas. */
(function () {
  const S = window.STORE, D = S.D, fmt = S.fmt;
  const view = document.getElementById("view");
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icons = () => window.lucide && window.lucide.createIcons();

  const FASE_COLOR = { nuevo: "var(--teal)", calificado: "var(--mint)", cotizado: "var(--sun)", reservado: "var(--sea)", perdido: "var(--coral)" };
  const CANAL_TAG = { "Asistente web": "tag-teal", "Instagram": "tag-sun", "WhatsApp": "tag-sea", "TikTok": "tag-plain", "Referido": "tag-sun", "Cliente directo": "tag-plain" };
  const canalTag = (c) => `<span class="tag ${CANAL_TAG[c] || "tag-plain"}">${c === "Asistente web" ? '<i data-lucide="sparkles"></i>' : ""}${esc(c)}</span>`;
  const tarifa = (p, fecha) => { const m = S.toDate(fecha).getMonth(); return [11, 0, 2, 3, 7].includes(m) ? p.alta : p.baja; };

  // ---------- Aviso y panel lateral ----------
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(html) {
    toastEl.innerHTML = `<i data-lucide="check-circle-2"></i><span>${html}</span>`;
    icons();
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3600);
  }

  const drawer = document.getElementById("drawer"), scrim = document.getElementById("scrim");
  let lastFocus = null;
  function openDrawer(html, mount) {
    lastFocus = document.activeElement;
    drawer.innerHTML = html;
    icons();
    drawer.classList.add("open"); scrim.classList.add("open");
    drawer.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeDrawer));
    mount && mount(drawer);
    setTimeout(() => (drawer.querySelector("input, select, button:not([data-close])") || drawer).focus(), 60);
  }
  function closeDrawer() {
    drawer.classList.remove("open"); scrim.classList.remove("open");
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });
  const drawerHead = (title, sub) => `<div class="drawer-head"><div><h2 id="drawer-title">${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>
    <button class="icon-btn" type="button" data-close aria-label="Cerrar"><i data-lucide="x"></i></button></div>`;

  // ---------- Clientes (CRM) ----------
  const crm = { q: "", canal: "Todos" };

  function renderClientes() {
    const leads = S.leads.filter((l) =>
      (crm.canal === "Todos" || l.canal === crm.canal) &&
      (!crm.q || (l.nombre + " " + l.resumen + " " + (S.prop(l.interes)?.nombre || "")).toLowerCase().includes(crm.q.toLowerCase())));
    const deNoche = S.leads.filter((l) => l.canal === "Asistente web" && l.fase === "nuevo").length;

    view.innerHTML = `
      ${mobileBrand()}
      <div class="page-head">
        <div>
          <h1>Clientes</h1>
          <p>Cada consulta del asistente, Instagram o WhatsApp entra aquí con lo que ya se habló. Arrastra una tarjeta para cambiarla de fase.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" type="button" id="nuevo-cliente"><i data-lucide="user-plus"></i>Nuevo cliente</button>
        </div>
      </div>
      <div class="crm-tools">
        <label class="search"><i data-lucide="search"></i><input class="input" id="q" type="search" placeholder="Buscar por nombre o propiedad" value="${esc(crm.q)}" aria-label="Buscar cliente"></label>
        <div class="chips" role="group" aria-label="Filtrar por canal">
          ${["Todos", ...D.CANALES].map((c) => `<button type="button" class="chip" data-canal="${c}" aria-pressed="${crm.canal === c}">${c}</button>`).join("")}
        </div>
      </div>
      ${deNoche ? `<p class="lead-line" style="font-size:14px;color:var(--muted);margin:-4px 0 16px">El asistente dejó <b style="color:var(--ink)">${deNoche} ${deNoche === 1 ? "cliente nuevo" : "clientes nuevos"}</b> listos para la asesora, con fechas, personas y presupuesto.</p>` : ""}
      <div class="board">
        ${D.FASES.map((f) => {
          const items = leads.filter((l) => l.fase === f.id);
          const valor = items.reduce((s, l) => s + l.presupuesto * Math.max(1, S.noches(l.llegada, l.salida)), 0);
          return `<section class="col" data-fase="${f.id}" aria-label="${f.nombre}">
            <div class="col-head"><span class="dot" style="background:${FASE_COLOR[f.id]}"></span>
              <div>${f.nombre}${items.length && f.id !== "perdido" ? `<small class="num">${fmt.usd(valor)} posibles</small>` : ""}</div>
              <span class="n">${items.length}</span></div>
            <div class="col-list">${items.map(card).join("") || `<div class="col-empty">${crm.q || crm.canal !== "Todos" ? "Nada con ese filtro" : "Sin clientes en esta fase"}</div>`}</div>
          </section>`;
        }).join("")}
      </div>`;
    icons();

    const q = view.querySelector("#q");
    q.addEventListener("input", () => { crm.q = q.value; renderClientes(); const n = view.querySelector("#q"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
    view.querySelectorAll("[data-canal]").forEach((b) => b.addEventListener("click", () => { crm.canal = b.dataset.canal; renderClientes(); }));
    view.querySelector("#nuevo-cliente").addEventListener("click", nuevoCliente);
    wireBoard();
  }

  function card(l) {
    const p = S.prop(l.interes);
    return `<article class="card" draggable="true" data-id="${l.id}" tabindex="0" aria-label="${esc(l.nombre)}">
      <div class="card-top"><div class="card-name">${esc(l.nombre)}</div><span class="card-time">${fmt.hace(l.creado)}</span></div>
      <div class="card-facts num">
        <span><i data-lucide="calendar"></i>${fmt.rango(l.llegada, l.salida)}</span>
        <span><i data-lucide="users"></i>${l.personas}</span>
        <span><i data-lucide="wallet"></i>${fmt.usd(l.presupuesto)}/noche</span>
      </div>
      <p class="card-note">${p ? `<b>${esc(p.nombre)}.</b> ` : ""}${esc(l.resumen)}</p>
      <div class="card-foot">${canalTag(l.canal)}${l.recurrente ? '<span class="tag tag-sea">Recurrente</span>' : ""}
        <select aria-label="Mover a otra fase" data-move="${l.id}">${D.FASES.map((f) => `<option value="${f.id}" ${f.id === l.fase ? "selected" : ""}>${f.nombre}</option>`).join("")}</select>
      </div>
    </article>`;
  }

  function wireBoard() {
    let dragId = null, dragged = false;
    view.querySelectorAll(".card").forEach((c) => {
      c.addEventListener("dragstart", (e) => { dragId = c.dataset.id; dragged = true; c.classList.add("dragging"); e.dataTransfer.setData("text/plain", dragId); e.dataTransfer.effectAllowed = "move"; });
      c.addEventListener("dragend", () => { c.classList.remove("dragging"); setTimeout(() => (dragged = false), 50); });
      c.addEventListener("click", (e) => { if (dragged || e.target.closest("select")) return; location.hash = "cliente/" + c.dataset.id; });
      c.addEventListener("keydown", (e) => { if (e.key === "Enter") location.hash = "cliente/" + c.dataset.id; });
    });
    view.querySelectorAll(".col").forEach((col) => {
      col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("drop"); });
      col.addEventListener("dragleave", (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove("drop"); });
      col.addEventListener("drop", (e) => {
        e.preventDefault(); col.classList.remove("drop");
        const id = e.dataTransfer.getData("text/plain") || dragId;
        moverConAviso(id, col.dataset.fase);
      });
    });
    view.querySelectorAll("[data-move]").forEach((s) => s.addEventListener("change", () => moverConAviso(s.dataset.move, s.value)));
  }

  function moverConAviso(id, fase) {
    const l = S.lead(id);
    if (!l || l.fase === fase) return;
    if (fase === "reservado") { location.hash = "cliente/" + id; setTimeout(() => registrarReserva(l), 250); return; }
    S.moverLead(id, fase);
    toast(`${esc(l.nombre)} pasó a <b>${D.FASES.find((f) => f.id === fase).nombre}</b>`);
  }

  function nuevoCliente() {
    openDrawer(`${drawerHead("Nuevo cliente", "Para consultas que llegan por Instagram, WhatsApp o en persona.")}
      <form class="drawer-body" id="f-cliente">
        <div class="form-grid">
          <div class="field full"><label for="nc-nombre">Nombre</label><input class="input" id="nc-nombre" required placeholder="Nombre y apellido"></div>
          <div class="field"><label for="nc-tel">Teléfono</label><input class="input" id="nc-tel" inputmode="tel" placeholder="+58 4xx xxx xxxx"></div>
          <div class="field"><label for="nc-canal">Canal</label><select class="input" id="nc-canal">${D.CANALES.filter((c) => c !== "Asistente web").map((c) => `<option>${c}</option>`).join("")}</select></div>
          <div class="field"><label for="nc-in">Llegada</label><input class="input" id="nc-in" type="date" value="2026-12-04" required></div>
          <div class="field"><label for="nc-out">Salida</label><input class="input" id="nc-out" type="date" value="2026-12-07" required></div>
          <div class="field"><label for="nc-pers">Personas</label><input class="input" id="nc-pers" type="number" min="1" value="4"></div>
          <div class="field"><label for="nc-pres">Presupuesto por noche ($)</label><input class="input" id="nc-pres" type="number" min="0" value="90"></div>
          <div class="field full"><label for="nc-nota">Qué busca</label><textarea class="input" id="nc-nota" rows="3" placeholder="Ej.: cerca de la playa, con estacionamiento para 2 carros"></textarea></div>
        </div>
      </form>
      <div class="drawer-foot"><button class="btn btn-ghost" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit" form="f-cliente">Agregar cliente</button></div>`,
    (d) => d.querySelector("#f-cliente").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => d.querySelector(id).value;
      const id = S.agregarLead({ nombre: v("#nc-nombre"), telefono: v("#nc-tel"), canal: v("#nc-canal"), fase: "nuevo", creado: D.HOY + "T11:25",
        llegada: v("#nc-in"), salida: v("#nc-out"), personas: +v("#nc-pers"), presupuesto: +v("#nc-pres"), motivo: "Por definir", edad: "",
        recurrente: false, interes: "", opciones: [], resumen: v("#nc-nota") || "Sin notas todavía.", conversacion: [] });
      closeDrawer();
      toast(`Cliente agregado en <b>Nuevo</b>. <a href="#cliente/${id}">Ver ficha</a>`);
    }));
  }

  // ---------- Ficha del cliente ----------
  function renderCliente(id) {
    const l = S.lead(id);
    if (!l) { view.innerHTML = `<a class="back" href="#clientes"><i data-lucide="arrow-left"></i>Clientes</a><p>Ese cliente ya no existe en el ejemplo.</p>`; icons(); return; }
    const n = S.noches(l.llegada, l.salida);
    const p = S.prop(l.interes);
    const reserva = S.reservas.find((r) => r.leadId === l.id);
    const porAsistente = l.canal === "Asistente web";
    const tel = (l.telefono || "").replace(/\D/g, "");

    view.innerHTML = `
      ${mobileBrand()}
      <a class="back" href="#clientes"><i data-lucide="arrow-left"></i>Clientes</a>
      <div class="page-head">
        <div><h1>${esc(l.nombre)}</h1><p>${canalTag(l.canal)} &nbsp;Llegó ${fmt.hace(l.creado)}${l.recurrente ? " · cliente recurrente" : ""}</p></div>
        <div class="page-actions">
          ${tel ? `<a class="btn btn-whatsapp" href="https://wa.me/${tel}" target="_blank" rel="noopener"><i data-lucide="message-circle"></i>Escribir por WhatsApp</a>` : ""}
          ${reserva ? `<a class="btn btn-primary" href="#reservas/${reserva.id}"><i data-lucide="calendar-check"></i>Ver reserva</a>`
                    : `<button class="btn btn-primary" type="button" id="reservar"><i data-lucide="calendar-plus"></i>Registrar reserva</button>`}
        </div>
      </div>
      <div class="lead-grid">
        <div>
          <section class="panel">
            <h2>${porAsistente ? "Lo que dejó el asistente" : "Notas de la consulta"}</h2>
            <p class="summary">${esc(l.resumen)}</p>
            ${porAsistente ? `<div class="summary-by"><i data-lucide="sparkles"></i>Resumen escrito por el asistente al pasar el cliente a la asesora</div>` : ""}
          </section>
          <section class="panel">
            <h2>Datos de la reserva que busca</h2>
            <dl class="facts num">
              <div><dt>Fechas</dt><dd>${fmt.rango(l.llegada, l.salida)}</dd></div>
              <div><dt>Noches</dt><dd>${n}</dd></div>
              <div><dt>Personas</dt><dd>${l.personas}</dd></div>
              <div><dt>Presupuesto</dt><dd>${fmt.usd(l.presupuesto)} por noche</dd></div>
              <div><dt>Motivo del viaje</dt><dd>${esc(l.motivo || "—")}</dd></div>
              <div><dt>Rango de edad</dt><dd>${esc(l.edad || "—")}</dd></div>
              <div><dt>Le interesa</dt><dd>${p ? esc(p.nombre) : "—"}</dd></div>
              <div><dt>Cliente recurrente</dt><dd>${l.recurrente ? "Sí" : "No"}</dd></div>
            </dl>
          </section>
          ${l.opciones.length ? `<section class="panel">
            <h2>Opciones que se le enviaron <small>precio para sus fechas</small></h2>
            <div class="opts">${l.opciones.map((pid) => { const o = S.prop(pid); const t = tarifa(o, l.llegada) * n;
              return `<div class="opt"><img src="${o.foto}" alt="" loading="lazy"><div><b>${esc(o.nombre)}</b><span class="num">${fmt.usd(tarifa(o, l.llegada))} por noche · ${fmt.usd(t)} total · abono ${fmt.usd(t / 2)}</span></div></div>`; }).join("")}</div>
          </section>` : ""}
          <section class="panel">
            <h2>Conversación</h2>
            ${l.conversacion.length ? `<div class="convo">${l.conversacion.map((m) => `<div class="bubble ${m.de}"><b>${m.de === "asistente" ? "Asistente" : m.de === "asesora" ? "Asesora" : esc(l.nombre.split(" ")[0])}</b>${esc(m.texto)}<time>${m.hora}</time></div>`).join("")}</div>`
              : `<p class="convo-empty">La conversación de este cliente fue por ${esc(l.canal)} antes de usar el sistema.</p>`}
          </section>
        </div>
        <div class="side-panel">
          <section class="panel">
            <h2>Fase</h2>
            <div class="stage">${D.FASES.map((f) => `<button type="button" class="stage-btn" data-fase="${f.id}" aria-pressed="${l.fase === f.id}"><span class="dot" style="background:${FASE_COLOR[f.id]}"></span>${f.nombre}</button>`).join("")}</div>
            ${l.motivoPerdida ? `<p style="margin:12px 0 0;font-size:13.5px;color:var(--muted)">Motivo: ${esc(l.motivoPerdida)}</p>` : ""}
          </section>
          <section class="panel">
            <h2>Contacto</h2>
            <div class="contact"><span>Teléfono</span><b class="num">${esc(l.telefono || "Sin teléfono")}</b></div>
          </section>
          ${reserva ? (() => { const d = S.detalle(reserva); return `<section class="panel"><h2>Reserva</h2>
            <div class="money"><div><span>${esc(d.propiedad.nombre)}</span><span>${fmt.rango(d.llegada, d.salida)}</span></div>
            <div><span>Pagado</span><span>${fmt.usd(d.pagado)}</span></div><div class="total"><span>Saldo</span><span>${fmt.usd(d.saldo)}</span></div></div></section>`; })() : ""}
        </div>
      </div>`;
    icons();
    view.querySelectorAll(".stage-btn").forEach((b) => b.addEventListener("click", () => { moverConAviso(l.id, b.dataset.fase); if (b.dataset.fase !== "reservado") renderCliente(l.id); }));
    const btn = view.querySelector("#reservar");
    btn && btn.addEventListener("click", () => registrarReserva(l));
  }

  function registrarReserva(l) {
    const opciones = D.propiedades.filter((p) => p.cap >= l.personas);
    const preferida = l.interes && S.prop(l.interes)?.cap >= l.personas ? l.interes : opciones[0]?.id;
    openDrawer(`${drawerHead("Registrar reserva", esc(l.nombre))}
      <form class="drawer-body" id="f-res">
        <div class="form-grid">
          <div class="field full"><label for="rr-prop">Propiedad</label>
            <select class="input" id="rr-prop">${opciones.map((p) => `<option value="${p.id}" ${p.id === preferida ? "selected" : ""}>${esc(p.nombre)} · hasta ${p.cap} personas</option>`).join("")}</select></div>
          <div class="field"><label for="rr-in">Llegada</label><input class="input" type="date" id="rr-in" value="${l.llegada}"></div>
          <div class="field"><label for="rr-out">Salida</label><input class="input" type="date" id="rr-out" value="${l.salida}"></div>
          <div class="field"><label for="rr-total">Total ($)</label><input class="input num" type="number" min="0" step="5" id="rr-total"></div>
          <div class="field"><label for="rr-abono">Abono recibido ($)</label><input class="input num" type="number" min="0" step="5" id="rr-abono"></div>
          <div class="field full"><label for="rr-metodo">Método del abono</label><select class="input" id="rr-metodo">${D.METODOS.map((m) => `<option>${m}</option>`).join("")}</select></div>
        </div>
        <p id="rr-warn" class="tag tag-coral" hidden style="height:auto;padding:8px 12px;border-radius:10px;white-space:normal"></p>
        <div class="money" id="rr-money"></div>
      </form>
      <div class="drawer-foot"><button class="btn btn-ghost" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit" form="f-res">Guardar reserva</button></div>`,
    (d) => {
      const $ = (s) => d.querySelector(s);
      let totalTocado = false, abonoTocado = false;
      const calc = () => {
        const p = S.prop($("#rr-prop").value), n = Math.max(1, S.noches($("#rr-in").value, $("#rr-out").value));
        if (!totalTocado) $("#rr-total").value = tarifa(p, $("#rr-in").value) * n;
        const total = +$("#rr-total").value || 0;
        if (!abonoTocado) $("#rr-abono").value = total / 2;
        const abono = +$("#rr-abono").value || 0, gan = total * 0.22;
        $("#rr-money").innerHTML = `<div><span>${n} noches en ${esc(p.nombre)}</span><span>${fmt.usd(total)}</span></div>
          <div class="muted"><span>Abono hoy</span><span>${fmt.usd(abono)}</span></div>
          <div class="muted"><span>Saldo al llegar</span><span>${fmt.usd(Math.max(0, total - abono))}</span></div>
          <div class="total"><span>Ganancia Llégate</span><span>${fmt.usd(gan)}</span></div>
          <div class="muted"><span>Para ${esc(p.propietario)} (propietario)</span><span>${fmt.usd(total - gan)}</span></div>`;
        const choque = S.ocupada(p.id, $("#rr-in").value, $("#rr-out").value);
        $("#rr-warn").hidden = !choque;
        $("#rr-warn").textContent = choque ? `${p.nombre} ya tiene una reserva en esas fechas. Elige otra propiedad u otras fechas.` : "";
      };
      ["#rr-prop", "#rr-in", "#rr-out"].forEach((s) => $(s).addEventListener("change", () => { totalTocado = false; abonoTocado = false; calc(); }));
      $("#rr-total").addEventListener("input", () => { totalTocado = true; calc(); });
      $("#rr-abono").addEventListener("input", () => { abonoTocado = true; calc(); });
      calc();
      $("#f-res").addEventListener("submit", (e) => {
        e.preventDefault();
        if (!$("#rr-warn").hidden) { $("#rr-warn").animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], { duration: 240 }); return; }
        const abono = +$("#rr-abono").value || 0;
        const rid = S.agregarReserva({ leadId: l.id, cliente: l.nombre, prop: $("#rr-prop").value, llegada: $("#rr-in").value, salida: $("#rr-out").value,
          total: +$("#rr-total").value || 0, origen: l.canal, fecha: D.HOY, pagos: abono ? [{ monto: abono, metodo: $("#rr-metodo").value, fecha: D.HOY }] : [] });
        closeDrawer();
        toast(`Reserva guardada y copiada al Excel de respaldo. <a href="#reservas/${rid}">Ver cobros</a>`);
        if (location.hash === "#cliente/" + l.id) renderCliente(l.id);
      });
    });
  }

  // ---------- Reservas y cobros ----------
  let tabReservas = "cobrar";
  function renderReservas(abrir) {
    const todas = S.reservas.map(S.detalle).sort((a, b) => S.toDate(a.llegada) - S.toDate(b.llegada));
    const hoy = S.toDate(D.HOY);
    const activas = todas.filter((r) => S.toDate(r.salida) >= hoy);
    const enDias = (r, d) => { const x = (S.toDate(r.llegada) - hoy) / 86400000; return x >= 0 && x <= d; };
    const grupos = {
      cobrar: { nombre: "Por cobrar", lista: activas.filter((r) => r.saldo > 0) },
      llegadas: { nombre: "Llegan en 14 días", lista: activas.filter((r) => enDias(r, 14)) },
      todas: { nombre: "Todas", lista: todas },
    };
    const porCobrar = activas.reduce((s, r) => s + r.saldo, 0);
    const cobradoMes = todas.flatMap((r) => r.pagos).filter((p) => p.fecha.startsWith("2026-11")).reduce((s, p) => s + p.monto, 0);
    const llegan7 = activas.filter((r) => enDias(r, 7)).length;
    const liquidar = todas.filter((r) => r.llegada.startsWith("2026-11")).reduce((s, r) => s + r.bruto, 0);
    const lista = grupos[tabReservas].lista;

    view.innerHTML = `
      ${mobileBrand()}
      <div class="page-head">
        <div><h1>Reservas y cobros</h1><p>Abonos, saldos al llegar y lo que corresponde a cada propietario. Toca una reserva para registrar un pago o un ajuste.</p></div>
      </div>
      <dl class="kpis">
        <div class="kpi"><dt>Por cobrar</dt><dd>${fmt.usd(porCobrar)}<small>saldos de reservas activas</small></dd></div>
        <div class="kpi"><dt>Cobrado en noviembre</dt><dd>${fmt.usd(cobradoMes)}<small>abonos y saldos</small></dd></div>
        <div class="kpi"><dt>Llegan esta semana</dt><dd>${llegan7}<small>${llegan7 === 1 ? "reserva" : "reservas"} en 7 días</small></dd></div>
        <div class="kpi"><dt>Para propietarios en noviembre</dt><dd>${fmt.usd(liquidar)}<small>por liquidar</small></dd></div>
      </dl>
      <div class="tabs" role="tablist">${Object.entries(grupos).map(([k, g]) => `<button class="tab" role="tab" type="button" data-tab="${k}" aria-selected="${k === tabReservas}">${g.nombre}<span class="n">${g.lista.length}</span></button>`).join("")}</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Cliente</th><th>Propiedad</th><th>Fechas</th><th class="r hide-sm">Total</th><th class="r hide-sm">Pagado</th><th class="r">Saldo</th><th>Estado</th></tr></thead>
          <tbody>${lista.map((r) => `<tr data-id="${r.id}" tabindex="0">
            <td><b>${esc(r.cliente)}</b><span class="sub">${esc(r.origen)}</span></td>
            <td>${esc(r.propiedad.nombre)}<span class="sub">${esc(r.propiedad.propietario)}</span></td>
            <td class="num">${fmt.rango(r.llegada, r.salida)}<span class="sub">${r.noches} noches</span></td>
            <td class="r hide-sm">${fmt.usd(r.totalFinal)}</td>
            <td class="r hide-sm">${fmt.usd(r.pagado)}</td>
            <td class="r"><b>${r.saldo ? fmt.usd(r.saldo) : "—"}</b></td>
            <td>${estadoTag(r.estado)}</td></tr>`).join("") || `<tr class="empty-row"><td colspan="7">No hay reservas en esta lista.</td></tr>`}</tbody>
        </table>
      </div>`;
    icons();
    view.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tabReservas = b.dataset.tab; renderReservas(); }));
    view.querySelectorAll("tbody tr[data-id]").forEach((tr) => {
      tr.addEventListener("click", () => abrirReserva(tr.dataset.id));
      tr.addEventListener("keydown", (e) => { if (e.key === "Enter") abrirReserva(tr.dataset.id); });
    });
    if (abrir) abrirReserva(abrir);
  }
  const estadoTag = (e) => ({ pagada: '<span class="tag tag-sea">Pagada</span>', abonada: '<span class="tag tag-sun">Abonada</span>', pendiente: '<span class="tag tag-coral">Sin abono</span>' }[e]);

  function abrirReserva(id) {
    const r = S.detalle(S.reserva(id));
    if (!r) return;
    openDrawer(`${drawerHead(esc(r.cliente), `${esc(r.propiedad.nombre)} · ${fmt.rango(r.llegada, r.salida)} · ${r.noches} noches`)}
      <div class="drawer-body">
        <div class="money">
          <div><span>Total</span><span>${fmt.usd(r.total)}</span></div>
          ${r.descuento ? `<div class="muted"><span>Descuento</span><span>−${fmt.usd(r.descuento)}</span></div>` : ""}
          <div class="muted"><span>Pagado</span><span>${fmt.usd(r.pagado)}</span></div>
          <div class="total"><span>Saldo al llegar</span><span>${fmt.usd(r.saldo)}</span></div>
          <div class="muted"><span>Ganancia Llégate</span><span>${fmt.usd(r.ganancia)}</span></div>
          <div class="muted"><span>Para ${esc(r.propiedad.propietario)}</span><span>${fmt.usd(r.bruto)}</span></div>
        </div>
        <div><p class="section-title">Pagos</p>
          ${r.pagos.length ? `<ul class="pay-list">${r.pagos.map((p) => `<li><div><b class="num">${fmt.usd(p.monto)}</b><span>${esc(p.nota || p.metodo)}</span></div><span class="num">${fmt.fecha(p.fecha)}</span></li>`).join("")}</ul>`
            : `<p style="margin:0;font-size:14px;color:var(--muted)">Todavía no hay pagos registrados.</p>`}
        </div>
        ${r.saldo > 0 ? `<form id="f-pago"><p class="section-title">Registrar pago</p>
          <div class="form-grid">
            <div class="field"><label for="pg-monto">Monto ($)</label><input class="input num" id="pg-monto" type="number" min="1" step="0.5" value="${r.saldo}"></div>
            <div class="field"><label for="pg-metodo">Método</label><select class="input" id="pg-metodo">${D.METODOS.map((m) => `<option>${m}</option>`).join("")}</select></div>
          </div>
          <button class="btn btn-primary" type="submit" style="margin-top:12px;width:100%">Registrar pago</button>
        </form>
        <div><p class="section-title">Ajustes</p>
          <div class="action-stack">
            <button class="btn btn-ghost" type="button" id="aj-todo">El propietario cobró todo en la reserva</button>
            <form id="f-desc" style="display:flex;gap:8px"><input class="input num" id="desc" type="number" min="1" step="5" placeholder="Descuento en $" aria-label="Descuento en dólares"><button class="btn btn-ghost" type="submit">Aplicar</button></form>
          </div>
          <p style="margin:10px 0 0;font-size:12.5px;color:var(--muted)">Si el saldo sigue pendiente, la asesora recibe un aviso en el celular el día antes de la llegada.</p>
        </div>` : `<p class="tag tag-sea" style="height:auto;padding:10px 12px;border-radius:10px">Reserva pagada por completo.</p>`}
      </div>
      <div class="drawer-foot"><button class="btn btn-ghost" type="button" data-close>Cerrar</button></div>`,
    (d) => {
      const reopen = () => { renderReservas(); abrirReserva(id); };
      d.querySelector("#f-pago")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const monto = +d.querySelector("#pg-monto").value;
        if (!monto) return;
        S.agregarPago(id, { monto, metodo: d.querySelector("#pg-metodo").value, fecha: D.HOY });
        reopen(); toast(`Pago de ${fmt.usd(monto)} registrado`);
      });
      d.querySelector("#aj-todo")?.addEventListener("click", () => { S.agregarAjuste(id, { tipo: "todo-en-reserva" }); reopen(); toast("Marcada como cobrada completa en la reserva"); });
      d.querySelector("#f-desc")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const monto = +d.querySelector("#desc").value;
        if (!monto) return;
        S.agregarAjuste(id, { tipo: "descuento", monto }); reopen(); toast(`Descuento de ${fmt.usd(monto)} aplicado`);
      });
    });
  }

  // ---------- Estadísticas ----------
  let mesSel = 9; // octubre 2026
  const agg = (anio, mes, conjunto) => D.historico.filter((h) => h.anio === anio && h.mes === mes && (!conjunto || h.conjunto === conjunto))
    .reduce((a, h) => ({ reservas: a.reservas + h.reservas, noches: a.noches + h.noches, ventas: a.ventas + h.ventas, ganancia: a.ganancia + h.ganancia }), { reservas: 0, noches: 0, ventas: 0, ganancia: 0 });
  const prevMes = (anio, mes) => (mes === 0 ? [anio - 1, 11] : [anio, mes - 1]);

  function delta(a, b, etiqueta) {
    if (!b) return `<span class="delta flat">sin dato ${etiqueta}</span>`;
    const d = (a - b) / b;
    const cls = Math.abs(d) < 0.005 ? "flat" : d > 0 ? "up" : "down";
    const ic = cls === "up" ? "arrow-up-right" : cls === "down" ? "arrow-down-right" : "minus";
    return `<span class="delta ${cls}"><i data-lucide="${ic}"></i>${fmt.pct(Math.abs(d), 0)} ${etiqueta}</span>`;
  }

  function renderEstadisticas() {
    const A = 2026, m = mesSel;
    const cur = agg(A, m), [pa, pm] = prevMes(A, m), prev = agg(pa, pm), ly = agg(A - 1, m);
    const margen = cur.ventas ? cur.ganancia / cur.ventas : 0;
    const neto = cur.ganancia * (1 - D.COMISION_ASESORA);
    const metaPct = Math.min(1, cur.ganancia / D.META_MES);
    const porConjunto = D.conjuntos.map((c) => ({ c, ...agg(A, m, c.id), ly: agg(A - 1, m, c.id) })).sort((a, b) => b.ganancia - a.ganancia);
    const max = porConjunto[0]?.ganancia || 1;

    // Para mirar: sin reservas en los dos últimos meses, o caída fuerte frente al año pasado.
    const watch = [];
    for (const c of D.conjuntos) {
      const a = agg(A, m, c.id), b = agg(...prevMes(A, m), c.id);
      if (!a.reservas && !b.reservas) {
        let ult = null;
        for (let k = m; k >= 0 && !ult; k--) if (agg(A, k, c.id).reservas) ult = k;
        watch.push({ c, tipo: "fuerte", txt: ult !== null ? `Sin alquilar desde ${fmt.mes(ult)}` : "Sin alquilar este año" });
      } else {
        const l = agg(A - 1, m, c.id);
        if (l.ganancia > 150 && a.ganancia < l.ganancia * 0.55) watch.push({ c, tipo: "mild", txt: `Generó ${fmt.usd(a.ganancia)} frente a ${fmt.usd(l.ganancia)} en ${fmt.mes(m)} de 2025` });
      }
    }

    // Rotación del año: noches vendidas acumuladas.
    const anual = D.conjuntos.map((c) => { let n = 0, r = 0; for (let k = 0; k <= m; k++) { const x = agg(A, k, c.id); n += x.noches; r += x.reservas; } return { c, n, r }; }).sort((a, b) => b.n - a.n);

    const reparto = (obj, total) => Object.entries(obj).map(([k, v]) => ({ k, n: Math.round(v * total) }));
    const COLORES = ["var(--teal)", "var(--mint)", "var(--sun)", "#9fb7c4", "#d9a17a", "#c7d6d3"];
    const origenes = reparto(D.origenesMes, cur.reservas);
    const metodos = reparto(D.metodosMes, cur.ventas);

    const dir = cur.ganancia >= prev.ganancia ? "más" : "menos";
    view.innerHTML = `
      ${mobileBrand()}
      <div class="page-head">
        <div><h1>Estadísticas</h1><p>Tus números leídos por ti: cuánto genera cada conjunto, qué no está rotando y cómo vas frente al mes y al año anterior.</p></div>
        <div class="page-actions"><label class="field" style="gap:4px"><span class="hide-sm" style="font-size:12px;font-weight:600;color:var(--muted)">Mes</span>
          <select class="input month-pick" id="mes" aria-label="Mes">${Array.from({ length: 10 }, (_, i) => `<option value="${i}" ${i === m ? "selected" : ""}>${fmt.mes(i)[0].toUpperCase() + fmt.mes(i).slice(1)} 2026</option>`).join("")}</select></label></div>
      </div>
      <p class="lead-line">En ${fmt.mes(m)} Llégate ganó <b>${fmt.usd(cur.ganancia)}</b> con ${cur.reservas} reservas y ${cur.noches} noches: ${fmt.pct(Math.abs((cur.ganancia - prev.ganancia) / (prev.ganancia || 1)), 0)} ${dir} que en ${fmt.mes(pm)}.
        ${porConjunto[0] ? `El conjunto que más generó fue <b>${esc(porConjunto[0].c.nombre)}</b>.` : ""}</p>
      <div class="stat-grid">
        <section class="panel span-7" style="margin:0">
          <h2>Cómo va el mes</h2>
          <dl class="compare">
            <div><dt>Ventas</dt><dd>${fmt.usd(cur.ventas)}</dd>${delta(cur.ventas, prev.ventas, "vs mes anterior")}<br>${delta(cur.ventas, ly.ventas, `vs ${fmt.mesCorto(m)} 2025`)}</div>
            <div><dt>Ganancia Llégate</dt><dd>${fmt.usd(cur.ganancia)}</dd>${delta(cur.ganancia, prev.ganancia, "vs mes anterior")}<br><span class="delta flat">margen ${fmt.pct(margen)}</span></div>
            <div><dt>Neto</dt><dd>${fmt.usd(neto)}</dd><span class="delta flat">después del 20 % de la asesora</span><br>${delta(neto, ly.ganancia * 0.8, `vs ${fmt.mesCorto(m)} 2025`)}</div>
          </dl>
          <div class="goal" style="margin-top:20px">
            <div class="goal-meta"><span><b style="color:var(--ink)">Meta del mes:</b> ${fmt.usd(D.META_MES)} de ganancia</span><span>${fmt.pct(cur.ganancia / D.META_MES, 0)}</span></div>
            <div class="goal-bar" role="img" aria-label="Avance de la meta ${fmt.pct(metaPct, 0)}"><span style="width:${metaPct * 100}%"></span></div>
          </div>
        </section>
        <section class="panel span-5" style="margin:0">
          <h2>Para echarle un ojo</h2>
          ${watch.length ? `<ul class="watch">${watch.slice(0, 5).map((w) => `<li class="${w.tipo === "mild" ? "mild" : ""}"><div><b>${esc(w.c.nombre)}</b><br><span>${w.txt}</span></div></li>`).join("")}</ul>`
            : `<p style="margin:0;color:var(--muted)">Todos los conjuntos alquilaron este mes.</p>`}
        </section>
        <section class="panel span-12" style="margin:0">
          <h2>Ganancia Llégate por mes</h2>
          <div class="legend"><span><i style="background:#b7ddd7"></i>2025</span><span><i style="background:var(--teal)"></i>2026</span></div>
          <div class="chart-scroll">${chartMeses(m)}</div>
        </section>
        <section class="panel span-7" style="margin:0">
          <h2>Conjuntos que más generaron <small>${fmt.mes(m)}</small></h2>
          <ol class="rank">${porConjunto.slice(0, 8).map((x) => `<li title="${x.reservas} reservas · ${x.noches} noches"><span>${esc(x.c.nombre)}</span><span class="bar"><span style="width:${(x.ganancia / max) * 100}%"></span></span><span class="val">${fmt.usd(x.ganancia)}</span></li>`).join("")}</ol>
        </section>
        <section class="panel span-5" style="margin:0">
          <h2>Más alquilados en 2026 <small>noches vendidas</small></h2>
          <ol class="rank">${anual.slice(0, 5).map((x) => `<li><span>${esc(x.c.nombre)}</span><span class="bar"><span style="width:${(x.n / anual[0].n) * 100}%;background:var(--mint)"></span></span><span class="val">${x.n}</span></li>`).join("")}</ol>
        </section>
        <section class="panel span-6" style="margin:0">
          <h2>De dónde vinieron las reservas</h2>
          <div class="stack" role="img" aria-label="Reparto por canal">${origenes.map((o, i) => `<span style="flex:${o.n || 0.0001};background:${COLORES[i]}"></span>`).join("")}</div>
          <ul class="split-list num">${origenes.map((o, i) => `<li><span><i style="background:${COLORES[i]}"></i>${o.k}</span><b>${o.n}</b></li>`).join("")}</ul>
        </section>
        <section class="panel span-6" style="margin:0">
          <h2>Cómo te pagaron</h2>
          <div class="stack" role="img" aria-label="Reparto por método de pago">${metodos.map((o, i) => `<span style="flex:${o.n || 0.0001};background:${COLORES[i]}"></span>`).join("")}</div>
          <ul class="split-list num">${metodos.map((o, i) => `<li><span><i style="background:${COLORES[i]}"></i>${o.k}</span><b>${fmt.usd(o.n)}</b></li>`).join("")}</ul>
        </section>
      </div>`;
    icons();
    view.querySelector("#mes").addEventListener("change", (e) => { mesSel = +e.target.value; renderEstadisticas(); });
  }

  function chartMeses(sel) {
    const W = 900, H = 250, L = 46, B = 26, T = 10;
    const vals = [2025, 2026].map((a) => Array.from({ length: 12 }, (_, k) => (a === 2026 && k > 9 ? null : agg(a, k).ganancia)));
    const maxV = Math.max(...vals.flat().filter((v) => v != null));
    const step = Math.ceil(maxV / 4 / 500) * 500, top = step * 4;
    const y = (v) => T + (H - T - B) * (1 - v / top);
    const gw = (W - L) / 12, bw = Math.min(16, gw / 3);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ganancia por mes, 2025 frente a 2026">`;
    for (let i = 0; i <= 4; i++) {
      const v = step * i, yy = y(v);
      s += `<line x1="${L}" x2="${W}" y1="${yy}" y2="${yy}" stroke="var(--line-soft)" stroke-width="1"/><text x="${L - 8}" y="${yy + 4}" text-anchor="end">${v ? "$" + (v / 1000).toLocaleString("es-VE") + "k" : "0"}</text>`;
    }
    for (let k = 0; k < 12; k++) {
      const x0 = L + gw * k + gw / 2;
      if (k === sel) s += `<rect x="${L + gw * k + 2}" y="${T}" width="${gw - 4}" height="${H - T - B}" rx="8" fill="var(--sun-wash)"/>`;
      [[vals[0][k], "#b7ddd7", -bw - 1], [vals[1][k], "var(--teal)", 1]].forEach(([v, c, dx], i) => {
        if (v == null) return;
        s += `<rect x="${x0 + dx}" y="${y(v)}" width="${bw}" height="${Math.max(1, y(0) - y(v))}" rx="4" fill="${c}"><title>${fmt.mes(k)} ${2025 + i}: ${fmt.usd(v)}</title></rect>`;
      });
      s += `<text x="${x0}" y="${H - 8}" text-anchor="middle" ${k === sel ? 'style="fill:var(--ink);font-weight:700"' : ""}>${fmt.mesCorto(k)}</text>`;
    }
    return s + "</svg>";
  }

  // ---------- Navegación ----------
  const mobileBrand = () => `<div class="mobile-brand"><img src="assets/logo.png" alt=""><b>Llégate a Lechería</b><a href="landing.html">Ver página</a></div>`;

  function route() {
    closeDrawer();
    const [seccion, id] = (location.hash.replace("#", "") || "clientes").split("/");
    const activo = seccion === "cliente" ? "clientes" : seccion;
    document.querySelectorAll("[data-nav]").forEach((a) => (a.dataset.nav === activo ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    if (seccion === "cliente") renderCliente(id);
    else if (seccion === "reservas") renderReservas(id);
    else if (seccion === "estadisticas") renderEstadisticas();
    else renderClientes();
    updateCount();
    window.scrollTo(0, 0);
  }
  function updateCount() {
    const n = S.leads.filter((l) => l.fase === "nuevo").length;
    document.getElementById("count-nuevos").textContent = n || "";
  }

  document.getElementById("reset").addEventListener("click", () => { S.restablecer(); route(); toast("Datos de ejemplo restablecidos"); });
  window.addEventListener("hashchange", route);
  window.addEventListener("storage", () => { S.recargar(); route(); }); // cambios hechos desde la página de clientes en otra pestaña
  S.on(updateCount);
  route();
})();
