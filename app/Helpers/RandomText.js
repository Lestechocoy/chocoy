function codigoRecibo(length) {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

/***************************************************************
   FUNCION PARA CREAR EL CODIGO DEL TRAMITE
   ***************************************************************/
function codigoTramite(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomString += characters.charAt(randomIndex);
  }
  const year = new Date().getFullYear().toString();
  return year + randomString;
}

module.exports = {
  codigoRecibo,
  codigoTramite,
};
