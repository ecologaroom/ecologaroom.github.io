import {
    getAuth,
} from "../lib/conexFirebase";

/* Ejecuta login con Google */
async function logIn() {

    // @ts-ignore
    const auth = firebase.auth();

    /* Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = new firebase.auth.GoogleAuthProvider();
    /* Configura el proveedor de Google para que permita seleccionar de una lista. */
    provider.setCustomParameters({ prompt: "select_account" });
    /* Pide datos para iniciar sesión. */
    await auth.signInWithRedirect(provider);
}