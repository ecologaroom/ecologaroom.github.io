/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();
const daoCliente = firestore.collection("Cliente");
// @ts-ignore
const daoUsuario = firestore.collection("Usuario");

/** @type {HTMLFormElement} */
const formUsuario = document["formUsuario"];

/* Conexión al sistema de autenticación de Firebase. */
  // @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(tieneRol, procesaError);

/** Valida que sea cliente */
async function validaCliente(usuario) {
  alert("Validando que sea cliente");
  if (tieneRol(usuario,["Cliente"])) {
    registroCliente
  } 
  
}

async function registroCliente(){
  alert("Si es un cliente");
  try {
    alert("Entra al try");
    const formData = new FormData(formUsuario);
    const nombre = getString(formData, "nombre").trim();
    alert("nombre" + nombre);  
    const ap_paterno = getString(formData, "ap_paterno").trim();
    alert("ap_materno" + ap_paterno); 
    const ap_materno = getString(formData, "ap_materno").trim();
    alert("ap_materno" + ap_materno); 
    const edad = getString(formData, "edad").trim();
    alert("edad" + edad); 
    const sexo = getString(formData, "sexo").trim();
    alert("sexo" + sexo); 
    const celular = getString(formData, "celular").trim();
    alert("celular" + celular); 
    const correo = getString(formData, "correo").trim();
    alert("correo" + correo); 
    /**
     ** @type { import("./tipos.js").Alumno} */
    const modelo = {nombre, ap_paterno, ap_materno, edad, sexo, celular, correo};
    alert("Guarda datos en modelo");
    await daoCliente.add(modelo); 
    alert("Sus datos han sido registrados exitosamente.");
  } catch (e) {
    procesaError(e);
  }
}

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario
 * @param {string[]} roles
 * @returns {Promise<boolean>} */
async function tieneRol(usuario, roles) {
  alert("Validando inicio de sesión");
  if (usuario && usuario.email) {
    alert("Si tiene sesión iniciada");
    const rolIds = await cargaRoles(usuario.email);

    for (const rol of roles) {
      alert("For de roles");
      if (rolIds.has(rol)) {
        alert("Su rol coincide con el de un cliente");
        return true;
      } else {
        alert("No autorizado.");
        location.href = "index.html";
      }
    }
  } else {
    alert("Lo manda a logear");
    logIn();
  }
  return false;
}

/** Busca si existe un rol y lo toma 
 * @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
    alert("Buscando su rol");
    /* Busa en la colección Usuario el email con el que se autesentificó */
    let doc = await daoUsuario.doc(email).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
          Usuario} */
      alert("Existe rol así que lo retorna");
      const data = doc.data();
      /* Existe email con rol, así que lo manda */
      return new Set(data.rolIds || []);
    } else {
        /* No existe email con rol, así que devuleve vacío */
      alert("No existe email con rol, así que devuleve vacío");
      return new Set();
    }
}

async function logIn() {
  /* Tipo de autenticación de usuarios. En este caso es con Google. */
// @ts-ignore
  const provider = new firebase.auth.GoogleAuthProvider();
  /* Configura el proveedor de Google para que permita seleccionar de una lista. */
  provider.setCustomParameters({ prompt: "select_account" });
  /* Recibe una función que se invoca cada que hay un cambio en la autenticación y recibe el modelo con las características del usuario.*/
  await auth.signInWithRedirect(provider);
}


/**
 * @param {FormData} formData
 * @param {string} name */
function getString(formData, name) {
  alert("Convirtiendo a String");
  const valor = formData.get(name);
  return (typeof valor === "string" ? valor : "" );
}

/* Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. */
function procesaError(e) {
  console.log(e);
  alert(e.message);
} 

/** @type {HTMLFormElement} */
const formReservacion = document["formReservacion"];

// @ts-ignore
const daoResevacion = firestore.collection("Reservacion");

/** Realiza reservación */
async function realizaReservacion(usuario) {
  alert("Botón realizar reservacion");

  if (tieneRol(usuario,["Cliente"])) {
    alert("Autorizado para realizar reservacion");
    try {
      alert("Entra al try");
      const formData = new FormData(formReservacion);
      const fecha_entrada = getString(formData, "fecha_entrada").trim();
      alert("fecha_entrada");  
      const fecha_salida = getString(formData, "fecha_salida").trim();
      alert("fecha_salida"); 
      const num_huespedes = getString(formData, "num_huespedes").trim();
      alert(num_huespedes); 
      const clv_huesped = usuario.email;
      alert(clv_huesped); 
      const estatus = "I";
      alert("estatus");

      /**
       ** @type { import("./tipos.js").Alumno} */
      const modelo = {fecha_entrada, fecha_salida, num_huespedes, clv_huesped, estatus};
      await daoResevacion.add(modelo);
      alert("Se ha realizado la reservación.");
    } catch (e) {
      procesaError(e);
    }
  }
} 

/** @type {HTMLFormElement} */
const formPago = document["formPago"];

// @ts-ignore
const daoResevacion = firestore.collection("Pago");

/** Realiza reservación */
async function efectuaPago(usuario) {
  alert("Botón efectuar pago");

  if (tieneRol(usuario,["Cliente"])) {
    alert("Autorizado para realizar el pago");
    try {
      alert("Entra al try");
      const formData = new FormData(formPago);
      const num_tarjeta = getString(formData, "num_tarjeta").trim();
      alert("num_tarjeta");  
      const caducidad = getString(formData, "mes").trim() + "/" + getString(formData, "año").trim();
      alert("caducidad"); 
      const cvv = getString(formData, "cvv").trim();
      alert("cvv"); 

      const estatus = "A";
      alert("estatus");

      /**
       ** @type { import("./tipos.js").Alumno} */
      const modelo = {num_tarjeta, caducidad, cvv};
      await daoResevacion.add(modelo);
      alert("Se ha efectuado el pago.");
      await daoResevacion.add(estatus)
    } catch (e) {
      procesaError(e);
    }
  }
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
