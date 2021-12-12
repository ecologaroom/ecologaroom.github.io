function copyNum() {
    var tel = "6121232583"
    navigator.clipboard.writeText(tel)
        .then(() => {
        alert("Número copiado en el portapapeles.");
    })
        .catch(err => {
        console.log('Something went wrong', err);
    })
}

function copyMail() {
    var mail = "ecologaroom@hotmail.com"
    navigator.clipboard.writeText(mail)
        .then(() => {
        alert("Número copiado en el portapapeles.");
    })
        .catch(err => {
        console.log('Something went wrong', err);
    })
}