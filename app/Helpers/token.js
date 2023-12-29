require('dotenv').config();
const jwt = require('jsonwebtoken'); // Asegúrate de tener la librería 'jsonwebtoken' instalada

/******************************************************************************************************
                 generar token
 *****************************************************************************************************/
// function generarToken(credenciales) {
//   const claveSecreta = process.env.SECRET || 'Leste';
//   const payload = {
//     usuarioId: 12345,
//     nombreUsuario: 'ejemploUsuario',
//   };
//   const token = jwt.sign(payload, claveSecreta, { expiresIn: '1m' });
//   console.log('Token JWT:', token);
//   return token;
// }

function generarToken(id) {
  const claveSecreta = process.env.SECRET || 'Leste';
  const payload = {
    id: id
  };

  const token = jwt.sign(payload, claveSecreta, { expiresIn: '24h' });

  return token;
}
/******************************************************************************************************
                 verificar Token
 *****************************************************************************************************/
function verificarToken(token) {
  const claveSecreta = process.env.SECRET || 'Leste';
  try {
    const decoded = jwt.verify(token, claveSecreta);
    if (decoded) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
  
}


module.exports = { generarToken, verificarToken };
