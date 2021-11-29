const botonGoogle = document.querySelector("#btnReservar");
botonGoogle.addEventListener('click', e=> {
    /* Conexión al sistema de autenticación de Firebase. */
    // @ts-ignore
    const auth = firebase.auth();
    /* Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = new firebase.auth.GoogleAuthProvider();
    /* No ha iniciado sesión. Pide datos para iniciar sesión. */
    auth.signInWithRedirect(provider);
})

function formLogin() {
    location.href = 'restaurantes.html';
}