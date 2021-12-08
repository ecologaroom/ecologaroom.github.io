/** @param {Event} evt */
async function registroCliente(evt) {
   /* Conexión al sistema de autenticación de Firebase. */
  // @ts-ignore
  const auth = firebase.auth();

  if (auth.onAuthStateChanged(tieneRol,procesaError) == true) {
    alert("Si es un cliente");
  } else {
    alert("No es un cliente");
  }

}

/** Verifica que exista una sesión abierta con un rol.
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario
 * @returns {Promise<boolean>} */
async function tieneRol(usuario) {
  if (usuario && usuario.email) {
    alert("Si inició sesisón");
    return true;
  } else {
    alert("Inicio de sesión");
  }
  procesaError
}



/* Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. */
function procesaError(e) {
  console.log(e);
  alert(e.message);
} 