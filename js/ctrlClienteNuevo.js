import {
    getAuth,
    getFirestore
  } from "../lib/conexionFirebase.js";

  import {
    getString,
    muestraError
} from "../lib/util.js";

import {
    tieneRol
} from "./seguridad.js";
  
  
  const colCliente = getFirestore().collection("Cliente");
  
  /** @type {HTMLFormElement} */
  const formUsuario = document["formUsuario"];
  
  getAuth().onAuthStateChanged(protege, muestraError);
  
  /** @param {import(
      "../lib/tipos.js").User}
      usuario */
  async function protege(usuario) {
    if (tieneRol(usuario,["Cliente"])) {
      formUsuario.addEventListener("submit", registraUsuario);
    }
  }
  
  /** @param {Event} evt */
  async function registraUsuario(evt) {
      try {
          evt.preventDefault();
          const formData = new FormData(formUsuario);
  
          const nombre = getString(formData, "nombre").trim();
          const ap_paterno = getString(formData, "ap_paterno").trim();  
          const ap_materno = getString(formData, "ap_materno").trim();  
          const edad = getString(formData, "edad").trim();
          const sexo = getString(formData, "sexo").trim();
          const celular = getString(formData, "celular").trim();
          const correo = getString(formData, "correo").trim();

          /**
           * @type {
              import("./tipos.js").
                      Alumno} */
          const modelo = {nombre, ap_paterno, ap_materno, edad, sexo, celular, correo};
          await colCliente.add(modelo);
          alert("Se te ha registrado exitosamente.");
      } catch (e) {
          muestraError(e);
      }
    }