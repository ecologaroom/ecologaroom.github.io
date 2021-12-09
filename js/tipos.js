/**
 * @typedef {Object} USUARIO
 * @property {string[]} ROLIDS
 */

/**
 * @typedef {Object} CLIENTE
 * @property {string} CORREO
 * @property {string} NOMBRE
 * @property {string} AP_PATERNO
 * @property {string} AP_MATERNO
 * @property {string} EDAD
 * @property {string} SEXO
 * @property {string} CELULAR
 */

/**
 * @typedef {Object} HABITACION
 * @property {string} NUM_HABITACION
 * @property {string} TIPO
 * @property {string} DISPONIBILIDAD
 */

/**
 * @typedef {Object} TIPO_HABITACION
 * @property {string} TIPO
 * @property {string} DESCRIPCION
 * @property {string} NUM_HUESPEDES
 */

// @ts-nocheck
/**
 * @typedef {Object} RESERVACION
 * @property {string} NUM_HABITACION
 * @property {string} ESTATUS
 * @property {string} CLV_HUESPED
 * @property {firebase.firestore.Timestamp} FECHA_RESERVACION
 * @property {string} FECHA_ENTRADA
 * @property {string} FECHA_SALIDA
 * @property {string} NUM_HUESPEDES
 */

export const __tipos = 0;