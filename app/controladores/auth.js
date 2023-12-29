//auth controller
const authModel = require('../modelos/auth');
const token = require('../middleware/auth');
const { generarToken } = require('../Helpers/token');
const respuesta = require('../Helpers/respuestas');
require('dotenv').config();


/******************************************************************************************************
               Validar Token
*****************************************************************************************************/
const jwt = require('jsonwebtoken');

async function validarToken(req, res) {
  const token = req.headers.authorization; // Obtener el token desde el encabezado
  if (!token) {
    return res.status(401).json({ tokenValido: false, mensaje: 'Token no proporcionado' });
  }
  // Decodificar el token para ver sus partes
  const claveSecreta = process.env.SECRET || 'Leste';
  try {
    const decoded = jwt.verify(token.split(' ')[1], claveSecreta);
    const idUser = decoded.id;
    const resultUser = await authModel.findUserById(idUser);
    res.status(200).json({ tokenValido: true, contenidoToken: resultUser });
  } catch (error) {
    res.status(401).json({ tokenValido: false, mensaje: 'Token inválido' });
  }
}




/******************************************************************************************************
               AUTENTICAR USUARIOS
*****************************************************************************************************/
async function authUser(req, res) {
  const datos = req.body;

  try {
    // Autentica al usuario
    const credenciales = await authModel.authUser(datos);
    if (credenciales) {
      const id = credenciales.credenciales.Id
      const token = generarToken(id);
      respuesta.success(req, res, { message: 'Login Exitoso',token });
    } else {
      respuesta.Unauthorized(req, res, { mensaje: 'Credenciales inválidas' }, 401);
    }
  } catch (error) {
    respuesta.error(req, res, 'Error en el servidor', 500);
    console.log(error)
  }
}

module.exports = {
  validarToken,
  authUser
};