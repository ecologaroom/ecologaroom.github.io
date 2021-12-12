/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();

/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(protege, procesaError);

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
        alert("Bienvenid@ de vuelta a Ecologaroom " + doc.data().NOMBRE);

        // @ts-ignore
        document.getElementById("correo").value = usuario.email;

        /* Transformación de tipo de dato TIMESTAMP en Firestore, por tipo Date en JS */
        document.getElementById("nombre").innerHTML = "";
        document.getElementById("nombre").innerHTML = '<input id="nombre" type="text" maxlength="40" readonly/>';
        // @ts-ignore
        document.getElementById("nombre").value = doc.data().NOMBRE;


      });
    } else {
      /* Cuando no existe registro de un correo. */
      alert("Bienvenid@ a Ecologaroom");
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

    /**
     * @type {
      import("./tipos.js").
        CLIENTE} */
    const modeloCliente = {
      CORREO: corr, 
      NOMBRE: nom, 
      AP_PATERNO: ap_pa, 
      AP_MATERNO:ap_ma, 
      EDAD: ed, 
      SEXO: sex, 
      CELULAR: cel
    };
    await firestore.collection("CLIENTE").add(modeloCliente); 
    alert("Sus datos han sido registrados exitosamente.");
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
    const nu_ha = document.getElementById("num_hab").value;
    // @ts-ignore
    const ti_ha = document.getElementById("tipoHab").value;

    // @ts-ignore
    const nom = document.getElementById("nombre").value;
    // @ts-ignore
    const ap_pa = document.getElementById('ap_paterno').value;
    // @ts-ignore
    const ap_ma = document.getElementById("ap_materno").value;

    const clv = nom + " " +  ap_pa + " " +  ap_ma; 
    alert("Clave:"+ clv);

    var fecha = new Date();
    const hoy = [fecha.getDate(), fecha.getMonth()+1, fecha.getFullYear()].join('-');
    alert("Fecha HOY:" + hoy);

    /**
     * @type {
      import("./tipos.js").
        RESERVACION} */
    const modeloReservacion= {
      NUM_HABITACION: 102,
      ESTATUS: true, 
      CLV_HUESPED: clv, 
      FECHA_RESERVACION: hoy, 
      FECHA_ENTRADA: fe_ll, 
      FECHA_SALIDA: fe_sa, 
      NUM_HUESPEDES: nu_hu
    };

    alert("Su reservación ha sido registrada exitosamente.");
    await firestore.collection("RESERVACION").add(modeloReservacion); 
    alert("YEEIII");
  } catch (e) {
    procesaError(e);
  }
}

/** Muestra las reservaciones por clv_huesped y se actualiza automáticamente. */
function ticket() {
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
  if(hab == 'Estándar Familiar'){
    habitacion.innerHTML = "";
    habitacion.innerHTML = hab;
    precio.innerHTML = "";
    precio.innerHTML = "($800/día)";
    numeroDias.innerHTML = "";
    numeroDias.innerHTML = dias + " días";

    var sumaHab = numeroHabs * 800;
    suma.innerHTML = "";
    suma.innerHTML = "$ " + sumaHab;

    var sumPago = dias * sumaHab;
    pago.innerHTML = "";
    pago.innerHTML = "$ " + sumPago;
  }
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
  alert("Convirtiendo a String");
  const valor = formData.get(name);
  alert("Valor del string obtenido:" + valor);
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