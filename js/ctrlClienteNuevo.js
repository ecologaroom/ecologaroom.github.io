/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();
const daoCliente = firestore.collection("Cliente");

/** @type {HTMLFormElement} */
const formUsuario = document["formUsuario"];

/* Conexión al sistema de autenticación de Firebase. */
// @ts-ignore
const auth = firebase.auth();
auth.onAuthStateChanged(protege,procesaError)

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,["Cliente"])) {
    alert("Tiene rol de Cliente");
    formUsuario.addEventListener("submit", guarda);
  }
}

/** Verifica que exista una sesión abierta con un rol.
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

/** Busca si existe un rol y lo toma 
 * @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
    /* Busa en la colección Usuario el email con el que se autesentificó */
    let doc = await daoUsuario.doc(email).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
          Usuario} */
      const data = doc.data();
      /* Existe email con rol, así que lo manda */
      return new Set(data.rolIds || []);
    } else {
        /* No existe email con rol, así que devuleve vacío */
      return new Set();
    }
}

/* Tipo de autenticación de usuarios. En este caso es con Google. */
// @ts-ignore
const provider = new firebase.auth.GoogleAuthProvider();

/* Manda a iniciar sesión con Google */
function logIn(){
  /* Configura el proveedor de Google para que permita seleccionar de una lista. */
  provider.setCustomParameters({ prompt: "select_account" });

  /* Recibe una función que se invoca cada que hay un cambio en la autenticación y recibe el modelo con las características del usuario.*/
  auth.onAuthStateChanged(procesaError)      
}

/** @param {Event} evt */
async function guarda(evt) {
  alert("Función guardar");
  try {
    evt.preventDefault();
    const formData = new FormData(formUsuario);
    const nombre = getString(formData, "nombre").trim();
    alert(nombre);  
    const ap_paterno = getString(formData, "ap_paterno").trim();
    alert(ap_paterno); 
    const ap_materno = getString(formData, "ap_materno").trim();
    alert(ap_materno); 
    const edad = getString(formData, "edad").trim();
    alert(edad); 
    const sexo = getString(formData, "sexo").trim();
    alert(sexo); 
    const celular = getString(formData, "celular").trim();
    alert(celular); 
    const correo = getString(formData, "correo").trim();
    alert(correo); 
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {nombre, ap_paterno, ap_materno, edad, sexo, celular, correo};
    await daoCliente.add(modelo);
    alert("Sus datos han sido registrados exitosamente.");
  } catch (e) {
    procesaError(e);
  }
}

/**
 * @param {FormData} formData
 * @param {string} name */
function getString(formData, name) {
  alert("Convirtiendo a String");
  const valor = formData.get(name);
  return (typeof valor === "string" ? valor : "" );
}

/* Procesa un error. Muestra el objeto en la consola y un cuadro de alerta con el mensaje. @param {Error} e descripción del error. */
function procesaError(e) {
  console.log(e);
  alert(e.message);
} 