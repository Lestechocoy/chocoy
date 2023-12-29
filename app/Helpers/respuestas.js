
/******************************************************************************************************
                 Respuesta de éxito
 *****************************************************************************************************/

exports.success = function (req, res, mensaje = '', status = 200) {
    res.status(status).send({
        error: false,
        status: status,
        body: mensaje
    });
}

/******************************************************************************************************
                 Respuesta de error Interno
 *****************************************************************************************************/
exports.error = function (req, res, mensaje = '', status = 500) {
    res.status(status).send({
        error: true,
        status: status,
        body: mensaje
    })
}


/******************************************************************************************************
                 Respuesta de No Autotizado
 *****************************************************************************************************/
exports.Unauthorized = function (req, res, mensaje = '', status = 401) {
    res.status(status).send({
        error: true,
        status: status,
        body: mensaje // Descomenta esta línea para incluir el mensaje de error
    });
}


/******************************************************************************************************
                 Respuesta de No encontrado
 *****************************************************************************************************/
exports.NotFound = function (req, res, mensaje = '', status = 404) {
    res.status(status).send({
        error: true,
        status: status,
        body: mensaje
    })
}