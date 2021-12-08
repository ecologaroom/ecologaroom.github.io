alert("llega a ctrlSesión");

import {
  getAuth
} from "../lib/conexionFirebase";

import {
  muestraError
} from "../lib/util.js";

import {
  cargaRoles,
  iniciaSesión
} from "./seguridad.js";


/** @type {HTMLFormElement} */
const reserva = document["reserva"];

/* Función invocada al haber un cambio de usuario y recibe sus datos, en otro caso presenta un error. */
getAuth().onAuthStateChanged(cambiaUsuario,muestraError);

/**
  * @param {import(
      "../lib/tiposFire.js").User}
      usu */
async function cambiaUsuario(usu) {
  if (usu && usu.email) {
    alert("llega a carga roles");
    const roles = await cargaRoles(usu.email);
    alert("Rol es" + roles);
    /* Enlaces para clientes. */
    if (roles.has("Cliente")) {
      reserva.terminarSesión.addEventListener("click", location.href="reservacion_cliente");
      alert("Es cliente");
    }
    /* Enlaces para trabajadores. */
    if (roles.has("Trabajador")) {
      reserva.terminarSesión.addEventListener("click", location.href="reservacion_recepcion");
      alert("Es trabajador");
    }
  } else {
    // No ha iniciado sesión.
    iniciaSesión();
    alert("Necesita iniciar sesión");
  }
}
