alert("llega a ctrlSesión");

/** @type {HTMLFormElement} */
const reserva = document["reserva"];

async function formLogin(){
  /* Conexión al sistema de autenticación de Firebase. */
  // @ts-ignore
  const auth = firebase.auth();

  /* Tipo de autenticación de usuarios. En este caso es con Google. */
  // @ts-ignore
  const provider = new firebase.auth.GoogleAuthProvider();

  /* Configura el proveedor de Google para que permita seleccionar de una lista. */
  provider.setCustomParameters({ prompt: "select_account" });
  /* Recibe una función que se invoca cada que hay un cambio en la autenticación y recibe el modelo con las características del usuario.*/
  auth.onAuthStateChanged(
    /* Recibe las características del usuario o null si no ha iniciado sesión. */
    async usuarioAuth => {
      if (usuarioAuth && usuarioAuth.email) {
        // Usuario aceptado
        alert("llega a carga roles");
        const roles = await cargaRoles(usuarioAuth.email);
        alert("Rol es" + roles);
        /* Enlaces para clientes. */
        if (roles.has("Cliente")) {
          reserva.terminarSesión.addEventListener("click", location.href="reservacion_cliente");
          alert("Es cliente");
        }
        /* Enlaces para trabajadores. */
        if (roles.has("Trabajador")) {
          reserva.terminarSesión.addEventListener("click", location.href="reservacion_recepcion");
          alert("Es trabajador");
        }
      } else {
        // No ha iniciado sesión. Pide datos para iniciar sesión.
        await auth.signInWithRedirect(provider)
        /*provider.getRedirectResult().then(function(result) {
          if (usuarioAuth) {
            location.href = 'reservacion_cliente.html'; //After successful login, user will be redirected to home.html
          }
        })*/
      }
    },
    // Función que se invoca si hay un error al verificar el usuario.
    muestraError
  )      
}

// @ts-ignore
const firestore = firebase.firestore();
const daoUsuario = firestore.collection("Usuario");

/** @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
  let doc = await daoUsuario.doc(email).get();
  if (doc.exists) {
    /**
     * @type {
        import("./tipos.js").
        Usuario} */
    const data = doc.data();
    return new Set(data.rolIds || []);
  } else {
    return new Set();
  }
}

function muestraError(e) {
  console.error(e);
  alert(e.message);
}