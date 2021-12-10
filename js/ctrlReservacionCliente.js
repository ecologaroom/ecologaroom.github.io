/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();

/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(protege, procesaError);

/** @type {HTMLFormElement} */
const formDaoCliente = document["formDaoCliente"];
/** @type {HTMLFormElement} */
const formDaoReservacion = document["formDaoReservacion"];
/** @type {HTMLFormElement} */
const formDaoPago = document["formDaoPago"];

/** Valida que sea cliente
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["CLIENTE"])) {
    /////////////////////////////////////////////// Faltaría consultar sus datos si ya los ha registrado
    selectHabitaciones();
  }
}

/** Revisa si la sesión está iniciada y comprueba si es el rol autorizado.
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario
 * @param {string[]} roles
 * @returns {Promise<boolean>} */
async function tieneRol(usuario, roles) {
  if (usuario && usuario.email) {
    const rolIds = await cargaRoles(usuario.email);
    for (const rol of roles) {
      if (rolIds.has(rol)) {
        return true;
      }
    }
    alert("No autorizado.");
    location.href = "index.html";
  } else {
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
  if (doc.exists) {
    /**
     * @type {
        import("./tipos.js").
        USUARIO} */
    const data = doc.data();
    return new Set(data.ROLIDS || []);
  } else {
    return new Set();
  }
}

async function logIn() {
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

async function registroCliente(){
  try {
    alert("Entra al try de registroCliente");

    // @ts-ignore
    const NOMBRE = document.getElementById("nombre").value;
    alert("nombre:" + NOMBRE);
    // @ts-ignore
    const AP_PATERNO = document.getElementById("ap_paterno").value;
    alert("paterno:" + AP_PATERNO);
    // @ts-ignore
    const AP_MATERNO = document.getElementById("ap_materno").value;
    alert("materno:"+AP_MATERNO);

    // @ts-ignore
    const EDAD = document.getElementById("edad").value;
    alert("edad:" + EDAD);
    // @ts-ignore
    const CELULAR = document.getElementById("celular").value;
    alert("celular:" +CELULAR);
    // @ts-ignore
    const CORREO = document.getElementById("correo").value;
    alert("correo:" + CORREO);
    // @ts-ignore
    const SEXO = document.getElementById("sexo").value;

    alert("sexo:" +SEXO);

    /*
     * @type {
        import("./tipos.js").
                CLIENTE}  {
      CORREO, 
      NOMBRE, 
      AP_PATERNO, 
      AP_MATERNO, 
      EDAD, 
      SEXO, 
      CELULAR};
    alert("Guarda datos en modelo");

    await firestore.collection("CLIENTE").add(modeloCliente); 
    alert("Sus datos han sido registrados exitosamente.");*/

    
  } catch (e) {
    procesaError(e);
  }
}

/** Desplega tipo de habitaciones. */
function selectHabitaciones() {
  var selection = document.getElementById('tipoHab');
  selection.innerHTML = "";

  /* Registros de la colección Reservación, ordenados por número de habitación */
  // @ts-ignore
  firestore.collection("TIPO_HABITACION").orderBy("NUM_HUESPEDES").get().then(function(snap){
    if (snap.size > 0) {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      snap.forEach(function(doc){
        /* Transformación de tipo de dato TIMESTAMP en Firestore, por tipo Date en JS */
        document.getElementById("tipoHab").innerHTML += '<option class="tipoHabitaciones" value="doc.id">'+doc.id+'</option>';
      });
    } else {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      document.getElementById("tipoHab").innerHTML = '<option class="tipoHabitaciones" value="doc.id">'+"Habitaciones indisponibles"+'</option>';
    }
  });
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
function numHabitaciones() {
  var input = document.getElementById('inpFlotHab');
  input.innerHTML = "";
  input.innerHTML += '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="1" required/><label class="floating__label" data-content="# Habitaciones"></label>'

  // @ts-ignore
  var num = document.getElementById("num_hues").value;

  switch (num) {
    case '3':
    case '4':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="2" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '5':
    case '6':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="3" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '7':
    case '8':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="4" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '9':
    case '10':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="5" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '11':
    case '12':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="6" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '13':
    case '14':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="7" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '15':
    case '16':
      input.innerHTML = '<input class="floating__input" onChange="numTipoHabitaciones();" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="8" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    default:
      break;
  }
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
function numTipoHabitaciones() {
  var input = document.getElementById('inpFlotTipoHab');
  input.innerHTML = "";
  input.innerHTML += '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'

  // @ts-ignore
  var num = document.getElementById("num_hab").value;

  switch (num) {
    case '2':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    case '3':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    case '4':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    case '5':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    case '6':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    case '7':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    case '8':
      input.innerHTML = '<select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label><select id="tipoHab" class="floating__select" value="doc.id" placeholder="Habitación" required></select><label id="lblTipoHab" class="floating__label" data-content="Habitación"></label>'
      break;
    default:
      break;
  }
}

/** Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. 
 * @param {Error} e */
 function procesaError(e) {
  console.log(e);
  alert(e.message);
}

/**
 * @param {FormData} formData
 * @param {string} name */
function getString(formData, name) {
  alert("Convirtiendo a String");
  const valor = formData.get(name);
  alert("Valor del string obtenido:" + valor);
  return (typeof valor === "string" ? valor : "" );
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