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
 * @property {number} EDAD
 * @property {string} SEXO
 * @property {string} CELULAR
 */

/**
 * @typedef {Object} HABITACION
 * @property {number} NUM_HABITACION
 * @property {string} TIPO
 * @property {boolean} DISPONIBILIDAD
 */

/**
 * @typedef {Object} TIPO_HABITACION
 * @property {string} DESCRIPCION
 * @property {string} NUM_HUESPEDES
 */

// @ts-nocheck
/**
 * @typedef {Object} RESERVACION
 * @property {number} NUM_HABITACION
 * @property {boolean} ESTATUS
 * @property {string} CLV_HUESPED
 * @property {string} FECHA_RESERVACION
 * @property {string} FECHA_ENTRADA
 * @property {string} FECHA_SALIDA
 * @property {number} NUM_HUESPEDES
 */

export const __tipos = 0;