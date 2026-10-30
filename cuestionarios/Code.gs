/**
 * Cuestionarios de Llégate a Lechería.
 *
 * Publica cada cuestionario como página web con enlace público (sin iniciar sesión)
 * y guarda las respuestas en este mismo Google Sheet, una pestaña por cuestionario.
 *
 *   .../exec               -> cuestionario de Alejandro
 *   .../exec?f=chatbot     -> cuestionario del chatbot (Luis Enrique)
 */

const FORMS = {
  alejandro: { titulo: 'Cuestionario Llégate a Lechería', hoja: 'Respuestas Alejandro' },
  chatbot: { titulo: 'Cuestionario chatbot Llégate', hoja: 'Respuestas Chatbot' },
};

function doGet(e) {
  const formId = (e && e.parameter && FORMS[e.parameter.f]) ? e.parameter.f : 'alejandro';
  const t = HtmlService.createTemplateFromFile('Formulario');
  t.formId = formId;
  return t.evaluate()
    .setTitle(FORMS[formId].titulo)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}

/**
 * Guarda (o actualiza) la fila de una persona.
 * payload = { formId, id, estado, columnas: [[encabezado, valor], ...] }
 */
function guardar(payload) {
  const form = FORMS[payload && payload.formId];
  if (!form || !payload.id) throw new Error('Cuestionario no válido');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName(form.hoja) || ss.insertSheet(form.hoja);

    const fijos = ['ID', 'Estado', 'Última actualización'];
    let encabezados = hoja.getLastColumn() > 0
      ? hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].map(String)
      : [];
    if (encabezados.length === 0) encabezados = fijos.slice();

    // Añade columnas nuevas si el cuestionario creció.
    payload.columnas.forEach(([h]) => { if (encabezados.indexOf(h) === -1) encabezados.push(h); });
    hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold');
    hoja.setFrozenRows(1);

    const fila = new Array(encabezados.length).fill('');
    fila[0] = payload.id;
    fila[1] = payload.estado === 'enviado' ? 'Enviado' : 'En progreso';
    fila[2] = new Date();
    payload.columnas.forEach(([h, v]) => { fila[encabezados.indexOf(h)] = v; });

    const n = hoja.getLastRow();
    const ids = n > 1 ? hoja.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0])) : [];
    const i = ids.indexOf(String(payload.id));
    const destino = i === -1 ? n + 1 : i + 2;
    hoja.getRange(destino, 1, 1, fila.length).setValues([fila]);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
