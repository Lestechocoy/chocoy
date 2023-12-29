const jwt = require('jsonwebtoken');
const { generarToken, verificarToken } = require('../Helpers/token');
const respuesta = require('../Helpers/respuestas')


/******************************************************************************************************
                 generar token
 *****************************************************************************************************/
function NewToken(req, res, next) {
    const token = generarToken();
    res.locals.nuevoToken = token;

    next();
}


/******************************************************************************************************
                 verificar Token
 *****************************************************************************************************/
const VerifyToken = (req, res, next) => {

    const token = req.headers.authorization;
 
    if (!token) {

        respuesta.Unauthorized(req, res, 'Acceso no autorizado', 401);
    }
    const esTokenValido = verificarToken(token.split(' ')[1]);
    if (esTokenValido) {

        next();
    } else {
        respuesta.Unauthorized(req, res, 'Acceso no autorizado', 401);
        console.log('No válido')
    }
};

module.exports = { NewToken, VerifyToken };