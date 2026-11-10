/* Datos de ejemplo del prototipo. Nombres de personas inventados; los conjuntos son los de Lechería. */
(function () {
  const HOY = "2026-11-10";
  const TASA_BCV = 236.5; // Bs por dólar, valor de ejemplo

  const foto = (id) => `https://images.unsplash.com/${id}?w=900&h=640&fit=crop&q=70&auto=format`;
  const FOTOS = [
    "photo-1505693416388-ac5ce068fe85", "photo-1522708323590-d24dbb6b0267", "photo-1502672260266-1c1ef2d93688",
    "photo-1560448204-e02f11c3d0e2", "photo-1493809842364-78817add7ffb", "photo-1512917774080-9991f1c4c750",
    "photo-1484154218962-a197022b5858",
  ].map(foto);
  const HERO = foto("photo-1540541338287-41700207dee6").replace("w=900&h=640", "w=2000&h=1300");
  const PLAYA = foto("photo-1519046904884-53103b34b206");

  const conjuntos = [
    { id: "thai", nombre: "Thai", playa: "Playa Lido", min: 4 },
    { id: "puerto-morro", nombre: "Puerto Morro", playa: "Playa El Morro", min: 2 },
    { id: "marina-del-rey", nombre: "Marina del Rey", playa: "Playa Lido", min: 6 },
    { id: "costa-guaica", nombre: "Costa Guaica", playa: "Playa Mansa", min: 5 },
    { id: "doral-beach", nombre: "Doral Beach", playa: "Playa Lido", min: 1 },
    { id: "guaica-suites", nombre: "Guaica Suites", playa: "Playa Mansa", min: 7 },
    { id: "entremares", nombre: "Entremares", playa: "Playa El Morro", min: 3 },
    { id: "marina-mar", nombre: "Marina Mar", playa: "Playa Lido", min: 8 },
    { id: "mar-de-leva", nombre: "Mar de Leva", playa: "Playa Mansa", min: 4 },
    { id: "coral-suites", nombre: "Coral Suites", playa: "Playa El Morro", min: 6 },
    { id: "solmar", nombre: "Solmar", playa: "Playa Lido", min: 5 },
    { id: "pueblo-viejo", nombre: "Pueblo Viejo", playa: "Playa Mansa", min: 9 },
    { id: "tepuy-caribe", nombre: "Tepuy Caribe", playa: "Playa El Morro", min: 10 },
    { id: "guaica-real", nombre: "Guaica Real", playa: "Playa Mansa", min: 6 },
  ];

  const propietarios = ["Carmen Salazar", "Rafael Ortiz", "Gabriela Mendoza", "Luis Peñalver", "Andrea Rivas",
    "Héctor Marcano", "Daniela Bermúdez", "Jorge Itriago", "Mariela Cova", "Oscar Lugo"];

  const p = (id, conjunto, unidad, hab, cap, baja, alta, fotoIdx, extras, propietario) =>
    ({ id, conjunto, nombre: `${conjuntos.find(c => c.id === conjunto).nombre} ${unidad}`, unidad, hab, cap, baja, alta,
       foto: FOTOS[fotoIdx % FOTOS.length], extras, propietario: propietarios[propietario] });
  const propiedades = [
    p("thai-4b", "thai", "4B", 2, 6, 70, 110, 0, ["Piscina", "Planta eléctrica", "Wifi"], 0),
    p("thai-7a", "thai", "7A", 3, 8, 80, 130, 4, ["Piscina", "Vista al mar", "Wifi"], 0),
    p("thai-ph2", "thai", "PH-2", 3, 8, 95, 150, 5, ["Piscina", "Vista al mar", "Planta eléctrica"], 1),
    p("pm-12", "puerto-morro", "12", 2, 5, 65, 100, 1, ["Piscina", "Estacionamiento"], 2),
    p("pm-21", "puerto-morro", "21", 2, 6, 70, 105, 2, ["Piscina", "Wifi", "Acepta mascotas"], 2),
    p("mdr-3c", "marina-del-rey", "3C", 2, 6, 65, 100, 3, ["Piscina", "Planta eléctrica"], 3),
    p("mdr-8a", "marina-del-rey", "8A", 3, 7, 75, 115, 6, ["Piscina", "Vista al mar"], 3),
    p("cg-5", "costa-guaica", "5", 2, 5, 60, 90, 0, ["Piscina", "Wifi"], 4),
    p("cg-14", "costa-guaica", "14", 3, 8, 75, 120, 4, ["Piscina", "Tanque de agua"], 4),
    p("db-10", "doral-beach", "10", 2, 6, 80, 125, 5, ["Frente al mar", "Piscina", "Wifi"], 5),
    p("db-15", "doral-beach", "15", 1, 4, 65, 95, 1, ["Frente al mar", "Piscina"], 5),
    p("gs-2b", "guaica-suites", "2B", 1, 4, 60, 85, 2, ["Piscina", "Wifi"], 6),
    p("em-6", "entremares", "6", 2, 6, 70, 105, 3, ["Piscina", "Estacionamiento"], 7),
    p("mm-9", "marina-mar", "9", 2, 5, 60, 90, 6, ["Piscina"], 7),
    p("mdl-1", "mar-de-leva", "1", 2, 6, 65, 95, 0, ["Piscina", "Acepta mascotas"], 8),
    p("cs-4", "coral-suites", "4", 2, 6, 70, 110, 4, ["Piscina", "Vista al mar"], 8),
    p("sm-11", "solmar", "11", 2, 5, 60, 95, 5, ["Piscina", "Wifi"], 9),
    p("pv-3", "pueblo-viejo", "3", 3, 8, 75, 115, 1, ["Piscina", "Planta eléctrica"], 9),
    p("tc-2", "tepuy-caribe", "2", 2, 6, 65, 100, 2, ["Piscina"], 6),
    p("gr-7", "guaica-real", "7", 2, 6, 65, 100, 3, ["Piscina", "Estacionamiento"], 1),
  ];

  const FASES = [
    { id: "nuevo", nombre: "Nuevo" },
    { id: "calificado", nombre: "Calificado" },
    { id: "cotizado", nombre: "Cotizado" },
    { id: "reservado", nombre: "Reservado" },
    { id: "perdido", nombre: "Perdido" },
  ];
  const CANALES = ["Asistente web", "Instagram", "WhatsApp", "TikTok", "Referido", "Cliente directo"];
  const METODOS = ["Pago móvil", "Transferencia", "Zelle", "Binance", "Efectivo"];

  const chat = (...pares) => pares.map(([de, texto, hora]) => ({ de, texto, hora }));

  const leads = [
    { id: "L101", nombre: "Mariana Gómez", telefono: "+58 414 382 1190", canal: "Asistente web", fase: "nuevo",
      creado: "2026-11-10T08:42", llegada: "2026-12-19", salida: "2026-12-23", personas: 6, presupuesto: 120,
      motivo: "Vacaciones en familia", edad: "35–44", recurrente: false, interes: "thai-7a", opciones: ["thai-7a", "mdr-8a", "cg-14"],
      resumen: "Familia de 6 (4 adultos, 2 niños) busca apartamento con piscina cerca de la playa para Navidad. Presupuesto hasta $120 por noche. Le gustó Thai 7A por la vista al mar. Pide estacionamiento para 2 carros.",
      conversacion: chat(
        ["cliente", "Hola! Quiero info para un apartamento en diciembre", "08:31"],
        ["asistente", "¡Hola! Con gusto te ayudo. ¿Para qué fechas lo buscas y cuántas personas viajan?", "08:31"],
        ["cliente", "Del 19 al 23 de diciembre, somos 4 adultos y 2 niños", "08:33"],
        ["asistente", "Perfecto, 4 noches para 6 personas. ¿Tienes un presupuesto por noche en mente? Así te muestro lo que mejor encaja.", "08:33"],
        ["cliente", "Hasta 120 dólares la noche más o menos", "08:35"],
        ["asistente", "Tengo 3 opciones libres con piscina y cerca de la playa: Thai 7A ($130/noche, vista al mar), Marina del Rey 8A ($115) y Costa Guaica 14 ($120). En temporada alta el abono es del 50 %.", "08:36"],
        ["cliente", "Me gusta el Thai! tiene estacionamiento para 2 carros?", "08:40"],
        ["asistente", "Te paso con la asesora para confirmarte el estacionamiento y apartarte las fechas. Toca el botón y se abre WhatsApp con tu solicitud ya escrita.", "08:41"],
      ) },
    { id: "L102", nombre: "Carlos Rondón", telefono: "+58 424 901 2233", canal: "Instagram", fase: "nuevo",
      creado: "2026-11-10T07:15", llegada: "2026-11-27", salida: "2026-11-29", personas: 2, presupuesto: 70,
      motivo: "Escapada en pareja", edad: "25–34", recurrente: false, interes: "db-15", opciones: [],
      resumen: "Pareja quiere un fin de semana frente al mar a finales de noviembre. Pregunta por Doral Beach.",
      conversacion: chat(["cliente", "Buenas, precio del Doral Beach para 2 personas el 27 de noviembre?", "07:15"]) },
    { id: "L103", nombre: "Yorgelis Patiño", telefono: "+58 416 551 7720", canal: "Asistente web", fase: "nuevo",
      creado: "2026-11-09T23:18", llegada: "2026-12-30", salida: "2027-01-03", personas: 8, presupuesto: 150,
      motivo: "Fin de año con amigos", edad: "25–34", recurrente: false, interes: "thai-ph2", opciones: ["thai-ph2", "pv-3"],
      resumen: "Grupo de 8 amigos para fin de año. Consultó a las 11 de la noche. Quiere vista al mar y planta eléctrica. Le mostró Thai PH-2 y Pueblo Viejo 3.",
      conversacion: chat(
        ["cliente", "hola para año nuevo 8 personas", "23:18"],
        ["asistente", "¡Hola! Para fin de año tengo 2 opciones para 8 personas: Thai PH-2 ($150/noche, vista al mar y planta eléctrica) y Pueblo Viejo 3 ($115). ¿Qué fechas exactas?", "23:18"],
        ["cliente", "del 30 al 3", "23:20"],
        ["asistente", "Listo, 4 noches. Thai PH-2 sale en $600 en total, con abono de $300. Mañana a primera hora la asesora te confirma.", "23:21"],
      ) },
    { id: "L104", nombre: "Familia Hernández", telefono: "+58 412 220 4418", canal: "WhatsApp", fase: "calificado",
      creado: "2026-11-08T14:05", llegada: "2026-12-26", salida: "2026-12-30", personas: 5, presupuesto: 100,
      motivo: "Vacaciones en familia", edad: "45–54", recurrente: true, interes: "pm-21", opciones: ["pm-21", "em-6"],
      resumen: "Cliente recurrente (vino en agosto). Busca algo parecido a Puerto Morro 21, que acepte su perro pequeño.",
      conversacion: chat(["cliente", "Hola Naylu, queremos volver en diciembre, el del perrito se puede?", "14:05"],
        ["asesora", "¡Hola! Claro, Puerto Morro 21 acepta mascotas. ¿Mismas 5 personas?", "14:22"]) },
    { id: "L105", nombre: "Ricardo Salas", telefono: "+58 414 778 3001", canal: "TikTok", fase: "calificado",
      creado: "2026-11-07T19:40", llegada: "2027-01-08", salida: "2027-01-11", personas: 4, presupuesto: 90,
      motivo: "Vacaciones", edad: "18–24", recurrente: false, interes: "cg-5", opciones: ["cg-5", "gs-2b"],
      resumen: "Vio un video en TikTok de Costa Guaica. 4 personas en enero, presupuesto ajustado.", conversacion: [] },
    { id: "L106", nombre: "Constructora Ávila", telefono: "+58 281 266 1400", canal: "Cliente directo", fase: "cotizado",
      creado: "2026-11-05T10:12", llegada: "2026-11-16", salida: "2026-11-30", personas: 3, presupuesto: 75,
      motivo: "Estadía corporativa", edad: "35–44", recurrente: false, interes: "mdr-3c", opciones: ["mdr-3c"],
      resumen: "Empresa necesita alojar a 3 ingenieros 14 noches. Pide factura y wifi estable. Cotización enviada: $1.050.", conversacion: [] },
    { id: "L107", nombre: "Andreína López", telefono: "+58 426 330 9182", canal: "Referido", fase: "cotizado",
      creado: "2026-11-06T16:30", llegada: "2026-12-12", salida: "2026-12-15", personas: 4, presupuesto: 100,
      motivo: "Cumpleaños", edad: "25–34", recurrente: false, interes: "db-10", opciones: ["db-10", "cs-4"],
      resumen: "La refirió la Familia Hernández. Celebra un cumpleaños. Cotizado Doral Beach 10: $375 por 3 noches.", conversacion: [] },
    { id: "L108", nombre: "Pedro Malavé", telefono: "+58 414 101 5543", canal: "Instagram", fase: "cotizado",
      creado: "2026-11-04T12:00", llegada: "2026-11-20", salida: "2026-11-22", personas: 2, presupuesto: 70,
      motivo: "Escapada en pareja", edad: "35–44", recurrente: false, interes: "gs-2b", opciones: ["gs-2b"],
      resumen: "Cotizado Guaica Suites 2B por 2 noches ($120). No ha respondido desde el día 5.", conversacion: [] },
    { id: "L109", nombre: "Valentina Ruiz", telefono: "+58 412 655 0021", canal: "Asistente web", fase: "reservado",
      creado: "2026-11-02T21:10", llegada: "2026-11-14", salida: "2026-11-17", personas: 4, presupuesto: 110,
      motivo: "Vacaciones", edad: "25–34", recurrente: false, interes: "thai-4b", opciones: ["thai-4b"],
      resumen: "Reservó Thai 4B después de hablar con el asistente un domingo en la noche.", conversacion: [] },
    { id: "L110", nombre: "José Gregorio Marín", telefono: "+58 424 812 7799", canal: "WhatsApp", fase: "reservado",
      creado: "2026-10-28T09:45", llegada: "2026-11-21", salida: "2026-11-24", personas: 6, presupuesto: 110,
      motivo: "Vacaciones en familia", edad: "45–54", recurrente: true, interes: "mdr-8a", opciones: ["mdr-8a"],
      resumen: "Cliente recurrente. Reservó Marina del Rey 8A.", conversacion: [] },
    { id: "L111", nombre: "Sofía Brito", telefono: "+58 416 902 3377", canal: "Instagram", fase: "perdido",
      creado: "2026-10-30T15:20", llegada: "2026-11-06", salida: "2026-11-08", personas: 3, presupuesto: 50,
      motivo: "Escapada", edad: "18–24", recurrente: false, interes: "", opciones: [], motivoPerdida: "Presupuesto muy bajo",
      resumen: "Buscaba algo por menos de $50 la noche.", conversacion: [] },
    { id: "L112", nombre: "Miguel Fermín", telefono: "+58 414 540 1180", canal: "TikTok", fase: "perdido",
      creado: "2026-10-26T11:05", llegada: "2026-11-01", salida: "2026-11-03", personas: 10, presupuesto: 120,
      motivo: "Grupo de amigos", edad: "18–24", recurrente: false, interes: "", opciones: [], motivoPerdida: "No había capacidad para 10",
      resumen: "Grupo de 10 personas; ninguna propiedad libre con esa capacidad.", conversacion: [] },
  ];

  // Reservas: [id, leadId, cliente, propiedad, llegada, salida, total, pagos [[monto, método, fecha]], origen, reservado el]
  const r = (id, leadId, cliente, prop, llegada, salida, total, pagos, origen, fecha) =>
    ({ id, leadId, cliente, prop, llegada, salida, total, origen, fecha,
       pagos: pagos.map(([monto, metodo, f]) => ({ monto, metodo, fecha: f })), ajustes: [] });
  const reservas = [
    r("R301", null, "Laura Figueroa", "db-10", "2026-11-06", "2026-11-09", 285, [[142.5, "Zelle", "2026-10-20"], [142.5, "Efectivo", "2026-11-06"]], "Instagram", "2026-10-20"),
    r("R302", null, "Alberto Acosta", "pm-12", "2026-11-07", "2026-11-09", 140, [[140, "Pago móvil", "2026-10-29"]], "WhatsApp", "2026-10-29"),
    r("R303", null, "Grupo Rojas", "thai-7a", "2026-11-08", "2026-11-11", 255, [[127.5, "Binance", "2026-10-25"]], "TikTok", "2026-10-25"),
    r("R304", null, "Daniel Tovar", "cg-5", "2026-11-11", "2026-11-14", 180, [[90, "Pago móvil", "2026-11-01"]], "Instagram", "2026-11-01"),
    r("R305", "L109", "Valentina Ruiz", "thai-4b", "2026-11-14", "2026-11-17", 210, [[105, "Zelle", "2026-11-03"]], "Asistente web", "2026-11-03"),
    r("R306", "L106", "Constructora Ávila", "mdr-3c", "2026-11-16", "2026-11-30", 910, [[455, "Transferencia", "2026-11-06"]], "Cliente directo", "2026-11-06"),
    r("R307", null, "Fabiola Ramos", "em-6", "2026-11-19", "2026-11-22", 210, [[210, "Zelle", "2026-11-04"]], "Referido", "2026-11-04"),
    r("R308", "L110", "José Gregorio Marín", "mdr-8a", "2026-11-21", "2026-11-24", 225, [[112.5, "Efectivo", "2026-10-29"]], "WhatsApp", "2026-10-29"),
    r("R309", null, "Nelson Guzmán", "sm-11", "2026-11-27", "2026-11-30", 180, [[90, "Pago móvil", "2026-11-08"]], "Instagram", "2026-11-08"),
    r("R310", null, "Familia Castro", "thai-ph2", "2026-12-18", "2026-12-22", 600, [[300, "Zelle", "2026-11-05"]], "Instagram", "2026-11-05"),
    r("R311", null, "Karla Zambrano", "db-10", "2026-12-23", "2026-12-27", 500, [[250, "Binance", "2026-11-07"]], "TikTok", "2026-11-07"),
    r("R312", null, "Eduardo Lárez", "pm-21", "2026-12-28", "2027-01-02", 525, [], "WhatsApp", "2026-11-09"),
    r("R313", null, "Ana Rengifo", "cs-4", "2027-01-02", "2027-01-05", 330, [[165, "Transferencia", "2026-11-09"]], "Instagram", "2026-11-09"),
  ];

  // Histórico mensual por conjunto (enero 2025 – octubre 2026), generado con semilla fija.
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ESTACION = [1.35, 0.7, 1.05, 1.25, 0.65, 0.6, 0.85, 1.4, 0.95, 0.7, 0.75, 1.5]; // ene..dic
  const PESO = { thai: 2.2, "puerto-morro": 1.3, "marina-del-rey": 1.2, "costa-guaica": 1.1, "doral-beach": 1.3,
    "guaica-suites": 0.9, entremares: 0.7, "marina-mar": 0.6, "mar-de-leva": 0.6, "coral-suites": 0.8, solmar: 0.6,
    "pueblo-viejo": 0.5, "tepuy-caribe": 0.45, "guaica-real": 0.5 };
  const historico = [];
  for (let y = 2025; y <= 2026; y++) {
    for (let m = 0; m < 12; m++) {
      if (y === 2026 && m > 9) break;
      const crecimiento = y === 2026 ? 1.08 : 1;
      for (const c of conjuntos) {
        let peso = PESO[c.id];
        if (c.id === "coral-suites" && y === 2026 && m >= 5) peso = 0;            // dejó de rotar
        if (c.id === "tepuy-caribe" && y === 2026 && m >= 7) peso = 0;
        if (c.id === "guaica-real" && y === 2026 && m >= 6) peso = 0.1;
        const reservasMes = Math.max(0, Math.round(peso * ESTACION[m] * crecimiento * (2.2 + rnd() * 2.2)));
        const noches = Math.round(reservasMes * (2.6 + rnd() * 1.4));
        const precio = 68 + rnd() * 22 + (ESTACION[m] > 1.2 ? 25 : 0);
        const ventas = Math.round(noches * precio / 5) * 5;
        const margen = (y === 2026 ? 0.225 : 0.205) + (rnd() - 0.5) * 0.04;
        const ganancia = Math.round(ventas * margen / 5) * 5;
        historico.push({ anio: y, mes: m, conjunto: c.id, reservas: reservasMes, noches, ventas, ganancia });
      }
    }
  }

  const origenesMes = { "Instagram": 0.38, "TikTok": 0.2, "WhatsApp": 0.14, "Referido": 0.08, "Cliente directo": 0.1, "Asistente web": 0.1 };
  const metodosMes = { "Zelle": 0.31, "Pago móvil": 0.27, "Binance": 0.18, "Efectivo": 0.14, "Transferencia": 0.1 };

  window.DEMO = { HOY, TASA_BCV, HERO, PLAYA, conjuntos, propiedades, FASES, CANALES, METODOS, leads, reservas,
    historico, origenesMes, metodosMes, META_MES: 2600, COMISION_ASESORA: 0.2 };
})();
