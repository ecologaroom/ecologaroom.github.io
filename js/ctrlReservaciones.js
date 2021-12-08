/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();
const daoReservaciones = firestore.collection("Reservacion");

/** @type {HTMLFormElement} */
const forma = document["forma"];

/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");

/** Muestra las reservaciones y se actualiza automáticamente. */
function consulta() {
  alert("entra a consulta");
  /* Registros de la colección Reservación, ordenados por número de habitación */
  daoReservaciones.orderBy("num_habitacion", "desc").onSnapshot(htmlLista, errConsulta);
}

/** Muestra actualizadamente datos enviados por el servidor.
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap estructura parecida a un Array, copia de los datos del servidor. */
function htmlLista(snap) {
  alert("entra a htmllist");
  let html = "";
  if (snap.size > 0) {
    /* Uno por uno se revisan los documentos de la consulta y los muestra. El iterador*/
    snap.forEach(doc => html += htmlFila(doc));
  } else {
    /* Cuando el número de documentos es 0, agrega un texto HTML. */
    html += /* html */
      `<li class="vacio">
        -- No hay mensajes registrados. --
      </li>`;
  }
  lista.innerHTML = html;
}

/** Agrega el texto HTML a un documento de una reservación.
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
function htmlFila(doc) {
  /** Recupera los datos del documento.
   * @type {import("./tipos.js").
                      Mensaje} */
  const data = doc.data();
  /* Agrega un li con los datos
   * del documento, los cuales se
   * codifican para evitar
   * inyección de código. */
  return ( /* html */
    `<li class="fila">
      <strong class="primario">
        ${escape(data.usuarioId)}
      </strong>
      <span class="secundario">
        ${escape(data.texto)}
      </span>
    </li>`);
}

/** Función de que muestra el error al recuperar los registros. Aquí la conexión se cancela y debe volverse a conectar
 * @param {Error} e */
function errConsulta(e) {
  procesaError(e);
  // Intenta conectarse otra vez.
  consulta();
}

/** Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. 
 * @param {Error} e */
function procesaError(e) {
  console.log(e);
  alert(e.message);
}

/* Terminar la sesión. */
async function logOut() {
  /* Conexión al sistema de autenticación de Firebase. */
  // @ts-ignore
  const auth = firebase.auth();
  try {
      await auth.singOut();
  } catch (e) {
      procesaError(e);
  }
}