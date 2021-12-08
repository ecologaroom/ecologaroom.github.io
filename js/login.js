/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();

/* Tipo de autenticación de usuarios. En este caso es con Google. */
// @ts-ignore
const provider = new firebase.auth.GoogleAuthProvider();


function formLogin(){
    /* Configura el proveedor de Google para que permita seleccionar de una lista. */
    provider.setCustomParameters({ prompt: "select_account" });

    /* Recibe una función que se invoca cada que hay un cambio en la autenticación y recibe el modelo con las características del usuario.*/
    auth.onAuthStateChanged(cambiaBoton,procesaError)      
}

async function cambiaBoton(usuarioAuth) {
    if (usuarioAuth && usuarioAuth.email) {
        /* Usuario aceptado y con login es revisado en su rol. */
        const roles = await cargaRoles(usuarioAuth.email);
        const reserva = document["reserva"];

        /* Enlaces para clientes. */
        if (roles.has("Cliente")) {
            alert("CLiente!!!");
            reserva.btnReservar.addEventListener("click", location.href="reservacion_cliente.html");
        }
        /* Enlaces para trabajadores. */
        if (roles.has("Trabajador")) {
            alert("Trabajador");
            reserva.btnReservar.addEventListener("click", location.href="reservacion_recepcion.html");
        }
    } else {
        // No ha iniciado sesión. Pide datos para iniciar sesión.
        await auth.signInWithRedirect(provider);
    }
}

  /* Recibe las características del usuario o null si no ha iniciado sesión. 
      async usuarioAuth => {
        
      },
      // Función que se invoca si hay un error al verificar el usuario.
      procesaError*/

// @ts-ignore
const firestore = firebase.firestore();
const daoUsuario = firestore.collection("Usuario");

/** @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
    alert("Se está cargando el rol");
    let doc = await daoUsuario.doc(email).get();

    alert("Validando existencia de rol");
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
          Usuario} */
      const data = doc.data();
      alert("Existe el rol");
      return new Set(data.rolIds || []);
    } else {
    alert("No existe el rol");
      return new Set();
    }
}

  
  /* Terminar la sesión. */
  async function terminaSesion() {
    /* Conexión al sistema de autenticación de Firebase. */
    // @ts-ignore
    const auth = firebase.auth();
    try {
        await auth.singOut();
    } catch (e) {
        procesaError(e);
    }
  }
  
  /* Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. */
  function procesaError(e) {
    console.log(e);
    alert(e.message);
  } 