/* Conexión al sistema de Firestore. */
// @ts-ignore
const firestore = firebase.firestore();
const daoCliente = firestore.collection("Cliente");

/** @type {HTMLFormElement} */
const formUsuario = document["formUsuario"];

/** @param {Event} evt */
async function registroUsuario(evt) {
  /* Conexión al sistema de autenticación de Firebase. */
  // @ts-ignore
  const auth = firebase.auth();

  if (auth.onAuthStateChanged(tieneRol,procesaError)==true) {
    alert("Si es un cliente");
    try {
      evt.preventDefault();
      alert("Aquí marca error");  
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
}


/** Verifica que exista una sesión abierta con un rol.
 * @param {import(
    "../lib/tiposFire.js").User}
    usuario
 * @returns {Promise<boolean>} */
async function tieneRol(usuario) {
  alert("Revisando si tiene sesión");

  if (usuario && usuario.email) {
    alert("Ahora carga rol según el email");
    /* Usuario aceptado y con login es revisado en su rol. */
    const roles = await cargaRoles(usuario.email);
    /* Formulario de reservación para clientes. */
    if (roles.has("Cliente")) {
      return true;
    }
    /* Formulario de reservación para trabajadores. */
    else if (roles.has("Trabajador")) {
      return false;
    } else {
      alert("No autorizado.");
      location.href = "index.html";
    }
  } else {
    alert("Inicio de sesión");
    /* Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = new firebase.auth.GoogleAuthProvider();

    /* Configura el proveedor de Google para que permita seleccionar de una lista. */
    provider.setCustomParameters({ prompt: "select_account" });

    // No ha iniciado sesión. Pide datos para iniciar sesión.
    await auth.signInWithRedirect(provider);
  }
  procesaError
}



/** Busca si existe un rol y lo toma 
 * @param {string} email
 * @returns {Promise<Set<string>>}
 */
async function cargaRoles(email) { 
    alert("Buscando su rol");
    /* Busa en la colección Usuario el email con el que se autesentificó */
    let doc = await daoUsuario.doc(email).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
          Usuario} */
      alert("Existe rol así que lo retorna");
      const data = doc.data();
      /* Existe email con rol, así que lo manda */
      return new Set(data.rolIds || []);
    } else {
        /* No existe email con rol, así que devuleve vacío */
        alert("No existe email con rol, así que devuleve vacío");
      return new Set();
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