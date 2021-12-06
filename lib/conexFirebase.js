/** Conexión a la base de datos de Firebase. */
export function getFirestore() {
    // @ts-ignore
    return firebase.firestore();
}

/* Conexión al sistema de autenticación de Firebase. */
export function getAuth() {
    // @ts-ignore
    return firebase.auth();
}
      
/* Conexión al sistema de storage de Firebase. */
export function getStorage() {
    // @ts-ignore
    return firebase.storage();
}