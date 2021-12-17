/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();

/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(protege, procesaError);

/** Conexión a Firestorage */
// @ts-ignore
const storage = firebase.storage();

/** @type {HTMLFormElement} */
const formDaoCliente = document["formDaoCliente"];
/** @type {HTMLFormElement} */
const formDaoReservacion = document["formDaoReservacion"];
/** @type {HTMLFormElement} */
const formDaoPago = document["formDaoPago"];

/** Valida que sea cliente
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["CLIENTE"])) {
    registroAnterior(usuario);
    selectHabitaciones();
    imgHabitacionSencilla();
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

/* Busca si ya hay datos del cliente registrados, a partir de su email */
function registroAnterior(usuario){
  /* Registros de la colección Cliente, donde el atributo de correo sea igual al email del usuario*/
  // @ts-ignore
  firestore.collection("CLIENTE").where("CORREO", "==", usuario.email).get().then(function(snap){
    if (snap.size > 0) {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      snap.forEach(function(doc){
        /* Cuando existe registro del correo. */
        alert("Bienvenid@ de vuelta " + doc.data().NOMBRE);
        // @ts-ignore
        document.getElementById("correo").value = usuario.email;

        // @ts-ignore
        document.getElementById('nombre').setAttribute('readonly', true);
        // @ts-ignore
        document.getElementById("nombre").value = doc.data().NOMBRE;

        // @ts-ignore
        document.getElementById('ap_paterno').setAttribute('readonly', true);
        // @ts-ignore
        document.getElementById("ap_paterno").value = doc.data().AP_PATERNO;

        // @ts-ignore
        document.getElementById('ap_materno').setAttribute('readonly', true);
        // @ts-ignore
        document.getElementById("ap_materno").value = doc.data().AP_MATERNO;

        // @ts-ignore
        document.getElementById('edad').setAttribute('readonly', true);
        // @ts-ignore
        document.getElementById("edad").value = doc.data().EDAD;

        document.getElementById('sexo').innerHTML = "";
        document.getElementById('sexo').innerHTML += '<option id="sexoF" value="'+doc.data().SEXO+'">'+doc.data().SEXO+'</option>';

        var cel = doc.data().CELULAR;
        // @ts-ignore
        document.getElementById('celular').setAttribute('readonly', true);
        // @ts-ignore
        document.getElementById("celular").value = cel;

        // @ts-ignore
        document.getElementById('regCliente').disabled = true;
      });
    } else {
      /* Cuando no existe registro de un correo. */
      alert("Bienvenid@ a Ecologaroom");
      // @ts-ignore
      document.getElementById('correo').setAttribute('readonly', true);
      // @ts-ignore
      document.getElementById("correo").value = usuario.email;
    }
  });
}

async function registroCliente(){
  try {
    // @ts-ignore
    const nom = document.getElementById("nombre").value;
    // @ts-ignore
    const ap_pa = document.getElementById('ap_paterno').value;
    // @ts-ignore
    const ap_ma = document.getElementById("ap_materno").value;
    // @ts-ignore
    const ed = document.getElementById("edad").value;
    // @ts-ignore
    const sex = document.getElementById("sexo").value;
    // @ts-ignore
    const cel = document.getElementById("celular").value;
    // @ts-ignore
    const corr = document.getElementById("correo").value;

    if(confirm("Una vez acepte, sus datos no podrán ser modificados. ¿Estan correctos?")){
      /* Conecta a Firebase para cerrar sesión */
      await firestore.collection("CLIENTE").add(
        {
          CORREO: corr, 
          NOMBRE: nom, 
          AP_PATERNO: ap_pa, 
          AP_MATERNO:ap_ma, 
          EDAD: ed, 
          SEXO: sex, 
          CELULAR: cel,
        }
      );
      alert("Sus datos han sido registrados exitosamente.");
      // @ts-ignore
      protege();
    }
  } catch (e) {
    procesaError(e);
  }
}

/** Desplega tipo de habitaciones. */
function selectHabitaciones() {
  var selection = document.getElementById('tipoHab');
  selection.innerHTML = "";

  /* Registros de la colección Reservación, ordenados por número de habitación */
  // @ts-ignore
  firestore.collection("TIPO_HABITACION").orderBy("NUM_HUESPEDES").get().then(function(snap){
    if (snap.size > 0) {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      snap.forEach(function(doc){
        /* Transformación de tipo de dato TIMESTAMP en Firestore, por tipo Date en JS */
        document.getElementById("tipoHab").innerHTML += '<option class="tipoHabitaciones" id="tipoHab" value="'+doc.id+'">'+doc.id+'</option>';
      });
    } else {
      /* Cuando el número de documentos es 0, agrega un texto HTML. */
      document.getElementById("tipoHab").innerHTML = '<option class="tipoHabitaciones" id="tipoHab">'+"Habitaciones indisponibles"+'</option>';
    }
  });
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
function numHabitaciones() {

  var input = document.getElementById('inpFlotHab');
  input.innerHTML = "";

  // @ts-ignore
  var num = document.getElementById("num_hues").value;

  switch (num) {
    case '1':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="1" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '2':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="2" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '3':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="3" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '4':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="1" max="4" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '5':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="2" max="5" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '6':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="2" max="6" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '7':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="2" max="7" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '8':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="2" max="8" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '9':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="3" max="9" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '10':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="3" max="10" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '11':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="3" max="11" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '12':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="3" max="12" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '13':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="4" max="13" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '14':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="4" max="14" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '15':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="4" max="15" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '16':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="4" max="16" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '17':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="5" max="17" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '18':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="5" max="18" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '19':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="5" max="19" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '20':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="5" max="20" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '21':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="6" max="21" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '22':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="6" max="22" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '23':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="6" max="23" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '24':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="6" max="24" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '25':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="7" max="25" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '26':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="7" max="26" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '27':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="7" max="27" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '28':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="7" max="28" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '29':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="8" max="29" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    case '30':
      input.innerHTML = '<input class="floating__input" id="num_hab" name="Num_hab" type="number" placeholder="# Habitaciones" maxlength="2" min="8" max="30" required/><label class="floating__label" data-content="# Habitaciones"></label>'
      break;
    default: 
      break;
  }
}

async function realizaReservacion(){
  try {
    // @ts-ignore
    var calEnt = document.getElementById("fecha_llegada").value;
    const fe_ll = calEnt.toString().split("-").reverse().join("-");
    // @ts-ignore
    var calSal = document.getElementById("fecha_salida").value;
    const fe_sa = calSal.toString().split("-").reverse().join("-");
    // @ts-ignore
    const nu_hu = document.getElementById("num_hues").value;
    // @ts-ignore
    const nom = document.getElementById("nombre").value;
    // @ts-ignore
    const ap_pa = document.getElementById('ap_paterno').value;
    // @ts-ignore
    const ap_ma = document.getElementById("ap_materno").value;

    const clv = nom + " " +  ap_pa + " " +  ap_ma;

    var fecha = new Date();
    const hoy = [fecha.getDate(), fecha.getMonth()+1, fecha.getFullYear()].join('-');

    /* Registros de reservación con clave del cliente. */ 
    // @ts-ignore
    firestore.collection("RESERVACION").where("CLV_HUESPED", "==", clv).get().then(async function(snap){
      if (snap.size > 0) {
        /* Cuando el número de documentos es 0, agrega un texto HTML. */
        snap.forEach(function(doc){
          /* Existen reservaciones */
          alert("Ya ha realizado una reservación. De lo contrario, comuníquese con el hotel.");
        });
      } else {
        /* Cuando el número de reservaciones por cliente es nulo, agrega la reservación reciente. */
        alert("No hay reservaciones, así que debe registrar.");
        await firestore.collection("RESERVACION").add(
          {
            NUM_HABITACION: "102",
            ESTATUS: "true", 
            CLV_HUESPED: clv, 
            FECHA_RESERVACION: hoy, 
            FECHA_ENTRADA: fe_ll, 
            FECHA_SALIDA: fe_sa, 
            NUM_HUESPEDES: nu_hu
          }
        );
        alert("Su reservación ha sido registrada exitosamente.");
      }
    });
  } catch (e) {
    procesaError(e);
  }
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
async function ticket() {

  alert("Entra a ticket");

  // @ts-ignore
  var hab = document.getElementById('tipoHab').value;
  var precio = document.getElementById('precioDia');
  var habitacion = document.getElementById('habitacion');
  var numeroDias = document.getElementById('numeroDias');
  // @ts-ignore
  var numeroHabs = document.getElementById('num_hab').value;
  var suma = document.getElementById('sumaPrecio');
  var pago = document.getElementById('pago');

  // @ts-ignore
  var calEnt = document.getElementById("fecha_llegada").value;
  const fe_ll = calEnt.toString().split("-").reverse().join("-");
  // @ts-ignore
  var calSal = document.getElementById("fecha_salida").value;
  const fe_sa = calSal.toString().split("-").reverse().join("-");

  var aFecha1 = fe_ll.split('-');
  var aFecha2 = fe_sa.split('-');
  var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
  var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
  var dif = fFecha2 - fFecha1;
  var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
  

  if(hab == 'Estándar Sencilla'){
    imgHabitacionSencilla();

    habitacion.innerHTML = "";
    habitacion.innerHTML = hab;
    precio.innerHTML = "";
    precio.innerHTML = "($600/día)";
    numeroDias.innerHTML = "";
    numeroDias.innerHTML = dias + " días";
    
    var sumaHab = numeroHabs * 600;
    suma.innerHTML = "";
    suma.innerHTML = "$ " + sumaHab;

    var sumPago = dias * sumaHab;
    pago.innerHTML = "";
    pago.innerHTML = "$ " + sumPago;
  }
  
  if(hab == 'Estándar Plus'){

    alert("Es habitación plus");

    imgHabitacionPlus();

    habitacion.innerHTML = "";
    habitacion.innerHTML = hab;
    precio.innerHTML = "";
    precio.innerHTML = "($1,000/día)";
    numeroDias.innerHTML = "";
    numeroDias.innerHTML = dias + " días";

    var sumaHab = numeroHabs * 1000;
    suma.innerHTML = "";
    suma.innerHTML = "$ " + sumaHab;

    var sumPago = dias * sumaHab;
    pago.innerHTML = "";
    pago.innerHTML = "$ " + sumPago;
  }
}

function imgHabitacionSencilla(){
  alert("Entra a imgHabitacion Sencilla");
  storage.ref('Estandar_Sencilla.jpg').getDownloadURL().then(function(url) {
    alert("La url: " + url);
  // `url` es la URL de descarga para 'images/stars.jpg'
    try {
      //Inserta imagen del Storage
      // @ts-ignore
      return document.getElementById("imgHab").src = url;
    } catch (e) {
      procesaError(e);
    }
  });
}

function imgHabitacionPlus(){
  alert("Entra a imgHabitacionPlus");

  storage.ref('Estandar_Plus.jpg').getDownloadURL().then(function(url) {
  // `url` es la URL de descarga para 'images/stars.jpg'
  alert("La url: " + url);
    try {
      //Inserta imagen del Storage
      // @ts-ignore
      document.getElementById("imgHab").src = url;
      alert("ya asigno la url");
    } catch (e) {
      procesaError(e);
    }
  });
}


/** Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. 
 * @param {Error} e */
 function procesaError(e) {
  console.log(e);
  alert(e.message);
}

/**
 * @param {FormData} formData
 * @param {string} name */
function getString(formData, name) {
  const valor = formData.get(name);
  return (typeof valor === "string" ? valor : "" );
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