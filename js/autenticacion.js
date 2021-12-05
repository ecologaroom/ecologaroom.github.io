/*  Inicializa Firebase con la configuración del proyecto. Revisa la configuración en tu servidor de Firebase y cópiala aquí sustituyendo los asteriscos. Los campos deben quedar igual que en tu servidor. */
// @ts-ignore
firebase.initializeApp({
  apiKey: "AIzaSyAXoqlSzgA2an2L6uSSOtXFX4Q4zHr0Mvc",
  authDomain: "ecologaroom.firebaseapp.com",
  projectId: "ecologaroom",
  storageBucket: "ecologaroom.appspot.com",
  messagingSenderId: "509252941570",
  appId: "1:509252941570:web:e651c919f5d0902470741b",
  measurementId: "G-45R2RM4HV8"
});

/* Valida campos vacíos */
function validaVacio(valor) {
  valor = valor.replace("&nbsp;", "");
  valor = valor == undefined ? "" : valor;
  if (!valor || 0 === valor.trim().length) {
      return true;
      }
  else {
      return false;
      }
}

function formLogin(){
  var llegada = document.getElementById("fecha_lleg");
  var salida = document.getElementById("fecha_sal");
  var huespedes = document.getElementById("num_hues");

  if(validaVacio(llegada) || validaVacio(salida) || validaVacio(huespedes) ){
    alert("Favor de llenar todos los campos");
  } else {
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
        // Usuario aceptado y con login
        tipoUsuario();
      } else {
        // No ha iniciado sesión. Pide datos para iniciar sesión.
        await auth.signInWithRedirect(provider)
        provider.getRedirectResult().then(function(result) {
          if (usuarioAuth) {
            tipoUsuario(); //After successful login, user will be redirected to home.html
          }
        })
      }
    },
    // Función que se invoca si hay un error al verificar el usuario.
    procesaError
  )   
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


/* Otorga permisos de visualización según tipo de usuario */
async function tipoUsuario(usuarioAuth){
  // @ts-ignore
  if(usuarioAuth && usuarioAuth.email){
      /* Crea variable html */
      // @ts-ignore
      let html = "";
      /* Crea variable constante de usuario */
      // @ts-ignore
      const roles = await cargaRoles(usuarioAuth.email);

      if(roles.has("Cliente")){
          location.href = 'reservacion_cliente.html';
      }
      if(roles.has("Trabajador")){
          location.href = 'reservacion_recepcion.html';
      }
  }
}