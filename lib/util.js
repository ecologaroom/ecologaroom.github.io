/** Muestra en consola y cuadro de alerta un mensaje de error.
 * @param {Error} e descripción
 *  del error. */
export function muestraError(e) {
    console.error(e);
    alert(e.message);
}

/** Evita la inyección de código de textos que puedan interpretarse como HTML.
 * @param {string} texto
 * @returns {string} un texto que
 *  no puede interpretarse como
 *  HTML. */
export function escape(texto) {
    return (texto || "").toString().replace(/[<>"']/g, reemplaza);
}

/** @param {string} letra */
function reemplaza(letra) {
    switch (letra) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#039;";
        default: return letra;
    }
}

/**
 * @param {FormData} formData
 * @param {string} name */
export function getString(formData, name) {
    const valor = formData.get(name);
    return (typeof valor === "string" ? valor : "" );
}

/**
 * @param {FormData} formData
 * @param {string} name */
export function getForánea(formData, name) {
    const valor = formData.get(name);
    return (typeof valor === "string" ? (valor || null) : null );
}
