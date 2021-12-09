/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();

/* Tipo de autenticación de usuarios. En este caso es con Google. */
// @ts-ignore
const provider = new firebase.auth.GoogleAuthProvider();

/* Manda a iniciar sesión con Google */
function logIn(){
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
        /* Formulario de reservación para clientes. */
        if (roles.has("CLIENTE")) {
            reserva.btnReservar.addEventListener("click", location.href="reservacion_cliente.html");
        }
        /* Formulario de reservación para trabajadores. */
        if (roles.has("TRABAJADOR")) {
            reserva.btnReservar.addEventListener("click", location.href="reservacion_recepcion.html");
        }
    } else {
        // No ha iniciado sesión. Pide datos para iniciar sesión.
        await auth.signInWithRedirect(provider);
    }
    /* Función que se invoca si hay un error al verificar el usuario. */
    procesaError
}

/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();
/** Busca si existe un rol y lo toma 
 * @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) {
    /* Busa en la colección Usuario el email con el que se autesentificó */
    let doc = await firestore.collection("USUARIO").doc(email).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
          USUARIO} */
      const data = doc.data();
      /* Existe email con rol, así que lo manda */
      return new Set(data.ROLIDS || []);
    } else {
        /* No existe email con rol, así que devuleve vacío */
        /////////////////////////////////////////////////////////////////Aquí debería crear rolids////////////////////////////////////////////////
        firestore.collection("USUARIO").set(email);
        await firestore.collection("USUARIO").doc(email).set({
            ROLIDS: "CLIENTE"
        });
        return new Set();
    }
}
  
/* Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. */
function procesaError(e) {
    console.log(e);
    alert(e.message);
} 