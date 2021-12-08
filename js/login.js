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
    alert("Se verifica si ha o no iniciado sesión");
    if (usuarioAuth && usuarioAuth.email) {
        // Usuario aceptado y con login
        alert("Se le redireccionará");
        /*location.href = 'reservacion_cliente.html';*/
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