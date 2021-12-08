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