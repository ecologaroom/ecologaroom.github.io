/* Muestra un error en la consola y un cuadro de alerta con el mensaje descriptivo del error. */
export function muestraError(e) {
    console.error(e);
    alert(e.message);
}
  
/* Codifica un texto para que escape los caracteres especiales y no se pueda interpretar como HTML. Esta técnica evita la inyección de código. */
export function escape(texto) {
    return (texto || "").
      toString().
      replace(/[<>"']/g, reemplaza);
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
    return (
      typeof valor === "string" ?
        valor : "" 
    );
}
  
/**
* @param {FormData} formData
* @param {string} name */
export function getForánea(formData, name) {
    const valor = formData.get(name);
    return (
      typeof valor === "string" ?
        (valor || null) : null 
    );
}