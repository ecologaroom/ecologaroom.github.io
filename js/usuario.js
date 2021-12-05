
/* Otorga permisos de visualización según tipo de usuario */
// @ts-ignore
async tipoUsuario(usuario){
    // @ts-ignore
    if(usuario && usuario.email){
        /* Crea variable html */
        // @ts-ignore
        let html = "";
        /* Crea variable constante de usuario */
        // @ts-ignore
        const roles = await cargaRoles(usuario.email);

        if(roles.has("Cliente")){
            location.href = 'reservacion_cliente.html';
        }
        if(roles.has("Trabajador")){
            location.href = 'reservacion_recepcion.html';
        }
    }
}