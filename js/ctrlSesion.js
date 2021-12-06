import {
    getAuth,
    getFirestore
} from "../lib/conexFirebase";

import {
    muestraError
} from "../lib/util.js";


const reservacion = document.getElementById("reservar");

/* Conexión con Firestore. */
const firestore = getFirestore();

/* Obtención de la colección Usuario en Firestore */
const colUsuario = firestore.collection("Usuario");

/* Recibe una función que se invoca cada que hay un cambio en la autenticación y recibe el modelo con las características del usuario.*/  
getAuth().onAuthStateChanged(enviaSesion, muestraError);
  
/* Muestra los datos del usuario o manda a iniciar sesión en caso de que no haya empezado. */
function enviaSesion(usuario) {
    if (usuario && usuario.email) {
        // Usuario aceptado.
        rol();
    } else {
        // No ha iniciado sesión.
        logIn();
    }
}

/* Para rol de trabajador envía a las reservaciones de recepción */
function rol(usuario) {
  if (tieneRol(usuario,["Trabajador"])) {
    return location.href = 'reservacion_recepcion.html';
  } 
  /*
  if (tieneRol(usuario,["Cliente"])) {
    location.href = 'reservacion_cliente.html';
  } */
}

/* Verifica si tiene rol */
async function tieneRol(usuario, roles) {
    if (usuario && usuario.email) {
        /* Obtiene rol del usuario con el email entrante */
        const rolIds = await cargaRoles(usuario.email);
        for (const rol of roles) {
            /* Si se tiene un rol es verdadero */
            if (rolIds.has(rol)) {
                return true;
            }
        }
        /* Si no tiene rol le indica que no está autorizado */
        alert("No autorizado.");
        location.href = "index.html";
    } else {
        /* Si se tiene rol verdadero se manda al Login */
        logIn();
    }
    return false;
}

/* Obtención de roles */
async function cargaRoles(email) {
    /* Extracción de datos en la colección de Usuario, según el email brindado */
    let doc = await colUsuario.doc(email).get();
    /* Si existe la colección de Usuario */
    if (doc.exists) {
      const data = doc.data();
      return new Set(data.rolIds || []);
    /* En otro caso crear instancia Set */
    } else {
      return new Set();
    }
}

/* Ejecuta login con Google */
reservacion.addEventListener("click",  async function logIn() {
    /* Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = new firebase.auth.GoogleAuthProvider();
    /* Configura el proveedor de Google para que permita seleccionar de una lista. */
    provider.setCustomParameters({ prompt: "select_account" });
    /* Pide datos para iniciar sesión. */
    await getAuth().signInWithRedirect(provider);
});

/* Cierra sesión */
async function logOut() {
    try {
      await getAuth().signOut();
    } catch (e) {
        /* En caso de error se muestra cual es */
        muestraError(e);
    }
}