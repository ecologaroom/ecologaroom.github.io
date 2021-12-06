import {
    getFirestore
} from "../lib/conexFirebase.js";

import {
    subeStorage
} from "../lib/almacenamiento.js";

import {
    escape, getForánea, muestraError
} from "../lib/util.js";

 /* import {
    muestraUsuarios
  } from "./navegacion.js";*/
  
const SIN_ALUMNOS = /* html */
    `<option value="">
      -- Sin Alumnos --
    </option>`;
  
const firestore = getFirestore();
const daoRol = firestore.collection("Rol");
const daoAlumno = firestore.collection("Alumno");
const daoUsuario = firestore.collection("Usuario");
  
/**
   * @param {
      HTMLSelectElement} select
   * @param {string} valor */
export function
    selectAlumnos(select,valor) {
        valor = valor || "";
        daoAlumno.orderBy("nombre").onSnapshot(
            snap => {
                let html = SIN_ALUMNOS;
                snap.forEach(doc =>
                    html += htmlAlumno(doc, valor)
                );
                select.innerHTML = html;
            },
            e => {
                muestraError(e);
                selectAlumnos(select, valor);
            }
        );
    }
  
/**
   * @param {
    import("../lib/tiposFire.js").
    DocumentSnapshot} doc
   * @param {string} valor */
function
    htmlAlumno(doc, valor) {
    const selected = doc.id === valor ? "selected" : "";
    /**
     * @type {import("./colecciones").
                    Alumno} */
    const data = doc.data();
    return (/* html */
            `<option
                value="${escape(doc.id)}"
                ${selected}>
                ${escape(data.nombre)}
            </option>`
        );
    }
  
/**
   * @param {HTMLElement} elemento
   * @param {string[]} valor */
  export function
    checksRoles(elemento, valor) {
    const set =
      new Set(valor || []);
    daoRol.onSnapshot(
      snap => {
        let html = "";
        if (snap.size > 0) {
          snap.forEach(doc =>
            html +=
            checkRol(doc, set));
        } else {
          html += /* html */
            `<li class="vacio">
                -- No hay roles
                registrados. --
              </li>`;
        }
        elemento.innerHTML = html;
      },
      e => {
        muestraError(e);
        checksRoles(
          elemento, valor);
      }
    );
  }
  
  /**
   * @param {
      import("../lib/tiposFire.js").
      DocumentSnapshot} doc
   * @param {Set<string>} set */
  export function
    checkRol(doc, set) {
    /**
     * @type {
        import("./colecciones.js").Rol} */
    const data = doc.data();
    const checked =
      set.has(doc.id) ?
        "checked" : "";
    return (/* html */
      `<li>
        <label class="fila">
          <input type="checkbox"
              name="rolIds"
              value="${escape(doc.id)}"
            ${checked}>
          <span class="texto">
            <strong
                class="primario">
              ${escape(doc.id)}
            </strong>
            <span
                class="secundario">
            ${escape(data.descripción)}
            </span>
          </span>
        </label>
      </li>`);
  }
  
/**
   * @param {Event} evt
   * @param {FormData} formData
   * @param {string} id  */
export async function guardaUsuario(evt, formData,id) {
    try {
      evt.preventDefault();
      const alumnoId = getForánea(formData,"alumnoId");
      const rolIds = formData.getAll("rolIds");
      await daoUsuario.doc(id).set({alumnoId,rolIds});
      const avatar = formData.get("avatar");
      await subeStorage(id, avatar);
     /* muestraUsuarios();*/
    } catch (e) {
      muestraError(e);
    }
}