/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();

/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(protege, procesaError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["TRABAJADOR"])) {
    consulta();
  }
}

/** Revisa si la sesión está iniciada y comprueba si es el rol autorizado.
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario
 * @param {string[]} roles
 * @returns {Promise<boolean>} */
async function tieneRol(usuario, roles) {
  if (usuario && usuario.email) {
    const rolIds = await cargaRoles(usuario.email);
    for (const rol of roles) {
      if (rolIds.has(rol)) {
        return true;
      }
    }
    alert("No autorizado.");
    location.href = "index.html";
  } else {
    logIn();
  }
  return false;
}

/** Busca en la colección de Usuario si existe rol para el email del usuario.
 * @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
  let doc = await firestore.collection("USUARIO").doc(email).get();
  if (doc.exists) {
    /**
     * @type {
        import("./tipos.js").
        USUARIO} */
    const data = doc.data();
    return new Set(data.ROLIDS || []);
  } else {
    return new Set();
  }
}

async function logIn() {
  /** Autenticación con Google.
   * @type {import(
      "../lib/tiposFire.js").
      GoogleAuthProvider} */
  const provider =
    // @ts-ignore
    new firebase.auth.GoogleAuthProvider();
  /* Configura el proveedor de Google para que permita seleccionar de una lista. */
  provider.setCustomParameters({ prompt: "select_account" });
  await auth.signInWithRedirect(provider);
}

/** Muestra las reservaciones y se actualiza automáticamente. */
function consulta() {
  var tab = document.getElementById('tabla');
  tab.innerHTML = "";
  tab.innerHTML += '<tr><th colspan="1">#Habitación</th><th colspan="1">Reservación</th><th colspan="1">Estatus</th><th colspan="1">Huésped</th><th colspan="1">Fecha de reservación</th><th colspan="1">Entrada</th><th colspan="1">Salida</th><th colspan="1">#Huéspedes</th></tr>'

  /* Registros de la colección Reservación, ordenados por número de habitación */
  // @ts-ignore
  firestore.collection("RESERVACION").orderBy("NUM_HABITACION").get().then(function(snap){
    if (snap.size > 0) {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      snap.forEach(function(doc){
        document.getElementById("tabla").innerHTML += '<tr class="registro"><td>'+doc.data().NUM_HABITACION+'</td><td><button type="button" class="btnClave" title="Cancelar reservación" onClick="eliminaReservacion();">'+doc.id+'</button></td><td>'+doc.data().ESTATUS+'</td><td>'+doc.data().CLV_HUESPED+'</td><td>'+doc.data().FECHA_RESERVACION+'</td><td>'+doc.data().FECHA_ENTRADA+'</td><td>'+doc.data().FECHA_SALIDA+'</td><td>'+doc.data().NUM_HUESPEDES+'</td></tr>';
      });
    } else {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      document.getElementById("tabla").innerHTML = '<tr class="registro"><td>'+"-- No hay registros de reservaciones. --"+'</td></tr>';
    }
  });
}

/** Función de que muestra el error al recuperar los registros. Aquí la conexión se cancela y debe volverse a conectar
 * @param {Error} e */
function errConsulta(e) {
  procesaError(e);
  /* Intenta conectarse otra vez. */
  consulta();
}

/** Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. 
 * @param {Error} e */
function procesaError(e) {
  console.log(e);
  alert(e.message);
}

/** Evita la inyección de código de textos que puedan interpretarse como HTML.
 * @param {string} texto
 * @returns {string} un texto que
 *  no puede interpretarse como
 *  HTML. */
function escape(texto) {
  return (texto || "").toString().replace(/[<>"']/g, reemplaza);
}

/** Reemplaza caracteres especiales.
 * @param {string} letra */
function reemplaza(letra) {
  switch (letra) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return letra;
  }
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
function reservaHuesped() {
  var tab = document.getElementById('tabla');
  tab.innerHTML = "";
  tab.innerHTML += '<tr><th colspan="1">#Habitación</th><th colspan="1">Reservación</th><th colspan="1">Estatus</th><th colspan="1">Huésped</th><th colspan="1">Fecha de reservación</th><th colspan="1">Entrada</th><th colspan="1">Salida</th><th colspan="1">#Huéspedes</th></tr>'

  // @ts-ignore
  var nom = document.getElementById("buscar").value;
  alert(nom.trim());

  if(nom.trim() == ""){
    consulta();
  } else {
    /* Registros de la colección Reservación, ordenados por número de habitación */
    firestore.collection("RESERVACION").where("CLV_HUESPED", "==", nom.trim()).get().then(function(snap){
      if (snap.size > 0) {
        /* Cuando el número de documentos es 0, agrega un texto HTML. */
        snap.forEach(function(doc){
          document.getElementById("tabla").innerHTML += '<tr class="registro"><td>'+doc.data().NUM_HABITACION+'</td><td><button type="button" class="btnClave" title="Cancelar reservación" onClick="eliminaReservacion();">'+doc.id+'</button></td><td>'+doc.data().ESTATUS+'</td><td>'+doc.data().CLV_HUESPED+'</td><td>'+doc.data().FECHA_RESERVACION+'</td><td>'+doc.data().FECHA_ENTRADA+'</td><td>'+doc.data().FECHA_SALIDA+'</td><td>'+doc.data().NUM_HUESPEDES+'</td></tr>';
        });
      } else {
        /* Cuando el número de documentos es 0, agrega un texto HTML. */
        document.getElementById("tabla").innerHTML = '<tr class="registro"><td>'+"-- No hay registros de reservaciones en esta fecha. --"+'</td></tr>';
      }
    });
  }
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
function reservaFecha() {
  var tab = document.getElementById('tabla');
  tab.innerHTML = "";
  tab.innerHTML += '<tr><th colspan="1">#Habitación</th><th colspan="1">Reservación</th><th colspan="1">Estatus</th><th colspan="1">Huésped</th><th colspan="1">Fecha de reservación</th><th colspan="1">Entrada</th><th colspan="1">Salida</th><th colspan="1">#Huéspedes</th></tr>'

  // @ts-ignore
  var calendario = document.getElementById("calendario").value;
  var fecha = calendario.toString().split("-").reverse().join("-");

  alert(fecha);
 
  if(fecha == ""){
    consulta();
  } else {
    /* Registros de la colección Reservación, ordenados por número de habitación */
    firestore.collection("RESERVACION").where("FECHA_ENTRADA", "==", fecha).get().then(function(snap){
      if (snap.size > 0) {
        /* Cuando el número de documentos es 0, agrega un texto HTML. */
        snap.forEach(function(doc){
          document.getElementById("tabla").innerHTML += '<tr class="registro"><td>'+doc.data().NUM_HABITACION+'</td><td><button type="button" class="btnClave" title="Cancelar reservación" onClick="eliminaReservacion();">'+doc.id+'</button></td><td>'+doc.data().ESTATUS+'</td><td>'+doc.data().CLV_HUESPED+'</td><td>'+doc.data().FECHA_RESERVACION+'</td><td>'+doc.data().FECHA_ENTRADA+'</td><td>'+doc.data().FECHA_SALIDA+'</td><td>'+doc.data().NUM_HUESPEDES+'</td></tr>';
        });
      } else {
        /* Cuando el número de documentos es 0, agrega un texto HTML. */
        document.getElementById("tabla").innerHTML = '<tr class="registro"><td>'+"-- No hay registros de reservaciones en esta fecha. --"+'</td></tr>';
      }
    });
  }
}

async function eliminaReservacion(){
  try {
    var id = prompt("Si desea cancelar la reservación, favor de volver a ingresar el código", "");
    await firestore.collection("RESERVACION").doc(id).delete();
    consulta();
  } catch (e) {
    procesaError(e);
  }

}

/* Terminar la sesión. */
async function logOut() {
  try {
    if(confirm("¿Desea cerrar sesión?")){
      /* Conecta a Firebase para cerrar sesión */
      await auth.signOut().then(() => {
        location.href = "index.html";
      });  
    }
  } catch (e) {
    procesaError(e);
  }
}

function dateFormat(arg0, arg1) {
  throw new Error("Function not implemented.");
}
