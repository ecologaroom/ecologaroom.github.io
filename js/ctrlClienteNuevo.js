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
  alert("Entra a protege");
  if (tieneRol(usuario,["CLIENTE"])) {
    alert("Es cliente");
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

async function registroCliente(){
  alert("Registra a cliente");
  try {
    alert("Entra al try de registroCliente");
    const formDataCliente = new FormData(formDaoCliente);

    const NOMBRE = getString(formDataCliente, "nombre").trim();
    alert("nombre" + NOMBRE);  
    const AP_PATERNO = getString(formDataCliente, "ap_paterno").trim();
    alert("ap_materno" + AP_PATERNO); 
    const AP_MATERNO = getString(formDataCliente, "ap_materno").trim();
    alert("ap_materno" + AP_MATERNO); 
    const EDAD = getString(formDataCliente, "edad").trim();
    alert("edad" + EDAD);
    const SEXO = getString(formDataCliente, "sexo").trim();
    alert("sexo" + SEXO); 
    const CELULAR = getString(formDataCliente, "celular").trim();
    alert("celular" + CELULAR); 
    const CORREO = getString(formDataCliente, "correo").trim();
    alert("correo" + CORREO); 
    
    /**
     * @type {
        import("./tipos.js").
                CLIENTE} */
    const modeloCliente = {CORREO, NOMBRE, AP_PATERNO, AP_MATERNO, EDAD, SEXO, CELULAR};
    alert("Guarda datos en modelo");

    await firestore.collection("CLIENTE").add(modeloCliente); 
    alert("Sus datos han sido registrados exitosamente.");
  } catch (e) {
    procesaError(e);
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