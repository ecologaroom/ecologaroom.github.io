/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();

/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(protege, procesaError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  alert("Entra a protege");
  if (tieneRol(usuario,["TRABAJADOR"])) {
    alert("Es trabajador");
    consulta();
  }
}

/** Revisa si la sesión está iniciada y comprueba si es el rol autorizado.
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario
 * @param {string[]} roles
 * @returns {Promise<boolean>} */
async function tieneRol(usuario, roles) {
  alert("Verifica inicio de sesión");
  if (usuario && usuario.email) {
    alert("Si inició sesión");
    const rolIds = await cargaRoles(usuario.email);
    alert("Rol cargado");
    for (const rol of roles) {
      if (rolIds.has(rol)) {
        alert("Rol autorizado");
        return true;
      }
    }
    alert("No autorizado.");
    location.href = "index.html";
  } else {
    alert("No inició sesión");
    logIn();
  }
  return false;
}

/** Busca en la colección de Usuario si existe rol para el email del usuario.
 * @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
  let doc = await firestore.collection("USUARIO").doc(email).get();
  alert("Obtuvo rol de la colección");
  if (doc.exists) {
    /**
     * @type {
        import("./tipos.js").
        USUARIO} */
    const data = doc.data();
    alert("Si tiene rol asignado");
    return new Set(data.ROLIDS || []);
  } else {
    alert("No tiene rol asignado");
    return new Set();
  }
}

async function logIn() {
  alert("Rediccionando a google");
  /** Autenticación con Google.
   * @type {import(
      "../lib/tiposFire.js").
      GoogleAuthProvider} */
  const provider =
    // @ts-ignore
    new firebase.auth.GoogleAuthProvider();
  /* Configura el proveedor de Google para que permita seleccionar de una lista. */
  provider.setCustomParameters({ prompt: "select_account" });
  await auth.signInWithRedirect(provider);
}

/** Muestra las reservaciones y se actualiza automáticamente. */
function consulta() {
  alert("entra a consulta");
  /* Registros de la colección Reservación, ordenados por número de habitación */
  firestore.collection("RESERVACION").get().onSnapshot(tablaHTML, errConsulta);
  /* .orderBy("NUM_HABITACION", "desc")*//////////////////////////////////////////////////
}

/** Muestra actualizadamente datos enviados por el servidor.
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap estructura parecida a un Array, copia de los datos del servidor. */
function tablaHTML(snap) {
  alert("entra a formar la tabla.");
  let html = "";
  if (snap.size > 0) {
    alert("Hay registros, así que constuye");
    /* Uno por uno se revisan los documentos de la consulta y los muestra. El iterador*/
    snap.forEach(doc => html += htmlFila(doc));
    alert("Registros en html");
  } else {
    alert("No hay registros, así que envía vacío");
    /* Cuando el número de documentos es 0, agrega un texto HTML. */
    html += /* html */
    `<tr>
      <td>
        -- No hay alumnos registrados. --
      </td>
     </tr>`;
  }
  alert("Construye la lista a partir del html obtenido.");
  document.getElementById("tabla").innerHTML = html;
  alert("Registros o no insertados");
}

/////////////////////////////////////////////////////////////////////
/** Agrega el texto HTML a un documento de una reservación.
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
function htmlFila(doc) {
  alert("Generando fila.");
  /**
   * @type {import("./tipos.js").
                  RESERVACION} */
  const data = doc.data();
  const numHabitacion = escape(data.NUM_HABITACION);
  const clvReservacion = 1;
  const estatus= escape(data.ESTATUS);
  const huesped = escape(data.CLV_HUESPED);
  const fechaReservacion = escape(data.FECHA_RESERVACION);
  const entrada= escape(data.FECHA_ENTRADA);
  const salida = escape(data.FECHA_SALIDA);
  const numHuespedes = escape(data.NUM_HUESPEDES);;

  /* Agrega un li con los datos del documento, los cuales se codifican para evitar inyección de código. */
  return ( /* html */
    `<tr>
      <td>${numHabitacion}</td>
      <td>${clvReservacion}</td>
      <td>${estatus}</td>
      <td>${huesped}</td>
      <td>${fechaReservacion}</td>
      <td>${entrada}</td>
      <td>${salida}</td>
      <td>${numHuespedes}</td>
     </tr>`);
}

/** Función de que muestra el error al recuperar los registros. Aquí la conexión se cancela y debe volverse a conectar
 * @param {Error} e */
function errConsulta(e) {
  alert("Error en la consulta y reconexión");
  procesaError(e);
  /* Intenta conectarse otra vez. */
  consulta();
}

/** Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. 
 * @param {Error} e */
function procesaError(e) {
  console.log(e);
  alert(e.message);
}

/** Evita la inyección de código de textos que puedan interpretarse como HTML.
 * @param {string} texto
 * @returns {string} un texto que
 *  no puede interpretarse como
 *  HTML. */
function escape(texto) {
  return (texto || "").toString().replace(/[<>"']/g, reemplaza);
}

/** Reemplaza caracteres especiales.
 * @param {string} letra */
function reemplaza(letra) {
  switch (letra) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return letra;
  }
}

/* Terminar la sesión. */
async function logOut() {
  try {
    /* Conecta a Firebase para cerrar sesión */
    await auth.signOut().then(() => {
      location.href = "index.html";
    });  
  } catch (e) {
    procesaError(e);
  }
}