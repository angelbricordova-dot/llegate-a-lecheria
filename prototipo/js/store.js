/* Estado del prototipo: datos de ejemplo + cambios del visitante, guardados en este navegador. */
(function () {
  const D = window.DEMO;
  const KEY = "llegate-prototipo-v1";
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function fresh() {
    return { leads: clone(D.leads), reservas: clone(D.reservas) };
  }

  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { state = fresh(); }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento: sigue en memoria */ }
  }

  const DIA = 86400000;
  const toDate = (s) => new Date(s.length === 10 ? s + "T12:00" : s);
  const noches = (a, b) => Math.round((toDate(b) - toDate(a)) / DIA);
  const prop = (id) => D.propiedades.find((x) => x.id === id);
  const conjunto = (id) => D.conjuntos.find((x) => x.id === id);
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const MES_CORTO = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  const fmt = {
    usd: (n, dec) => "$" + Number(n).toLocaleString("es-VE", { minimumFractionDigits: dec ?? (n % 1 ? 2 : 0), maximumFractionDigits: dec ?? 2 }),
    bs: (n) => "Bs " + Math.round(n * D.TASA_BCV).toLocaleString("es-VE"),
    pct: (n, dec = 1) => (n * 100).toLocaleString("es-VE", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + " %",
    fecha: (s) => { const d = toDate(s); return `${d.getDate()} ${MES_CORTO[d.getMonth()]}`; },
    fechaLarga: (s) => { const d = toDate(s); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; },
    rango: (a, b) => {
      const x = toDate(a), y = toDate(b);
      return x.getMonth() === y.getMonth() ? `${x.getDate()}–${y.getDate()} ${MES_CORTO[y.getMonth()]}` : `${fmt.fecha(a)} – ${fmt.fecha(b)}`;
    },
    hace: (s) => {
      const min = Math.round((toDate(D.HOY + "T11:30") - toDate(s)) / 60000);
      if (min < 60) return `hace ${Math.max(min, 1)} min`;
      if (min < 1440) return `hace ${Math.round(min / 60)} h`;
      const d = Math.round(min / 1440);
      return d === 1 ? "ayer" : `hace ${d} días`;
    },
    mes: (i) => MESES[i], mesCorto: (i) => MES_CORTO[i],
  };

  // Una reserva con sus cifras calculadas.
  function detalle(res) {
    const n = noches(res.llegada, res.salida);
    let total = res.total;
    let descuento = 0;
    let cobradoEnReserva = false;
    for (const a of res.ajustes || []) {
      if (a.tipo === "descuento") descuento += a.monto;
      if (a.tipo === "todo-en-reserva") cobradoEnReserva = true;
    }
    total -= descuento;
    const pagado = res.pagos.reduce((s, x) => s + x.monto, 0);
    const saldo = Math.max(0, Math.round((total - pagado) * 100) / 100);
    const estado = saldo === 0 ? "pagada" : pagado > 0 ? "abonada" : "pendiente";
    const ganancia = Math.round(total * 0.22 * 100) / 100;
    return { ...res, noches: n, totalFinal: total, descuento, cobradoEnReserva, pagado, saldo, estado, ganancia,
      bruto: Math.round((total - ganancia) * 100) / 100, propiedad: prop(res.prop) };
  }

  // Fechas ocupadas por propiedad, para el catálogo y el asistente.
  function ocupada(propId, llegada, salida) {
    return state.reservas.some((r) => r.prop === propId && toDate(llegada) < toDate(r.salida) && toDate(salida) > toDate(r.llegada));
  }

  const listeners = [];
  const emit = () => { save(); listeners.forEach((fn) => fn()); };

  window.STORE = {
    D, fmt, noches, prop, conjunto, toDate, detalle, ocupada,
    get leads() { return state.leads; },
    get reservas() { return state.reservas; },
    lead: (id) => state.leads.find((l) => l.id === id),
    reserva: (id) => state.reservas.find((r) => r.id === id),
    on: (fn) => listeners.push(fn),
    moverLead(id, fase) {
      const l = this.lead(id);
      if (l && l.fase !== fase) { l.fase = fase; emit(); }
    },
    agregarLead(lead) {
      const id = "L" + (200 + state.leads.length + Math.floor(Math.random() * 900));
      state.leads.unshift({ id, ...lead });
      emit();
      return id;
    },
    agregarReserva(data) {
      const id = "R" + (400 + state.reservas.length);
      state.reservas.push({ id, ajustes: [], ...data });
      if (data.leadId) { const l = this.lead(data.leadId); if (l) l.fase = "reservado"; }
      emit();
      return id;
    },
    agregarPago(id, pago) { this.reserva(id).pagos.push(pago); emit(); },
    agregarAjuste(id, ajuste) {
      const r = this.reserva(id);
      r.ajustes = r.ajustes || [];
      if (ajuste.tipo === "todo-en-reserva") {
        r.ajustes = r.ajustes.filter((a) => a.tipo !== "todo-en-reserva");
        const d = detalle(r);
        if (d.saldo > 0) r.pagos.push({ monto: d.saldo, metodo: ajuste.metodo || "Zelle", fecha: D.HOY, nota: "Cobrado completo en la reserva" });
      }
      r.ajustes.push(ajuste);
      emit();
    },
    restablecer() { state = fresh(); emit(); },
    recargar() { try { state = JSON.parse(localStorage.getItem(KEY)) || state; } catch (e) { /* se queda lo que hay */ } },
  };
})();
