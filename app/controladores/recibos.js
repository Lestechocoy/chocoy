// userController.js

const reciboModel = require('../modelos/recibos');
const respuesta = require('../Helpers/respuestas');

/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS SERVICIOS PENDIENTES DE PAGO
//  *****************************************************************************************************/
async function getAllRecibos(req, res) {

    try {
        const users = await reciboModel.getAllRecibos();
        respuesta.success(req, res, users, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500)
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN CLIENTE Y SUS DATOS POR SU ID
 *****************************************************************************************************/
async function getRecibobyId(req, res) {
    try {
        const Id = req.params.id;
        const comprobante = await reciboModel.getRecibobyId(Id);
        if (!comprobante) {
            return respuesta.NotFound(req, res, 'Recibo no encontrado', 404)
        }
        respuesta.success(req, res, comprobante, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN RECIBO POR EL CODIGO
 *****************************************************************************************************/
                 async function validateReciboByCodigo(req, res) {
                    try {
                        const codigo = req.params.codigo;
                        const comprobante = await reciboModel.validateReciboByCodigo(codigo);
                        
                        if (!comprobante) {
                            return respuesta.NotFound(req, res, 'Recibo no encontrado', 404)
                        }
                        respuesta.success(req, res, comprobante, 200);
                    } catch (error) {
                        respuesta.error(req, res, 400);
                    }
                }


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN RECIBO POR SU ID y GENERAR PDF
 *****************************************************************************************************/
async function getReciboPDF(req, res) {
    try {
        const reciboId = req.params.id;
        const recibo = await reciboModel.getReciboPDF(reciboId);
        if (!recibo) {
            return respuesta.NotFound(req, res, 'Recibo no encontrado', 404)
        }
        respuesta.success(req, res, recibo, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN RECIBO POR SU ID y GENERAR PDF DESDE LA VISTA PÚBLICA
 *****************************************************************************************************/
                 async function getReciboPDFbyCodigo(req, res) {
                    try {
                        const codigo = req.params.codigo;
                        const recibo = await reciboModel.getReciboPDFbyCodigo(codigo);
                        if (!recibo) {
                            return respuesta.NotFound(req, res, 'Recibo no encontrado', 404)
                        }
                        respuesta.success(req, res, recibo, 200);
                    } catch (error) {
                        respuesta.error(req, res, error, 500);
                    }
                }


/******************************************************************************************************
                 CONTROLADOR PARA CREAR UN RECIBO NUEVO
 ******************************************************************************************************/
async function createRecibo(req, res) {
    const { clienteData, servicioData } = req.body; // Supongamos que los datos se envían como un objeto con dos propiedades: clienteData y reciboData
    try {
        const result = await reciboModel.createRecibo(clienteData, servicioData); // Llama a la función createRecibo con los datos del cliente y recibo
        respuesta.success(req, res, { message: 'Registro exitoso', result }, 200);
        console.log(result)
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



async function payment(req, res) {
    const data = req.body; // Supongamos que los datos se envían como un objeto con dos propiedades: clienteData y reciboData
    try {
        const result = await reciboModel.payment(data); // Llama a la función payment con los datos del cliente y recibo
        respuesta.success(req, res, { message: 'Transacción exitosa', result }, 200);
    } catch (error) {
        if (error === 503) {
            respuesta.error(req, res, 'El pago excede el saldo disponible', 503);
        } else if (error === 404) {
            respuesta.error(req, res, 'No se encontraron datos válidos de Saldo', 404);
        } else {
            respuesta.error(req, res, error, 500);
        }
    }
}




/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UN RECIBO POR SU ID
 *****************************************************************************************************/
async function deleteReciboById(req, res) {
    try {
        const Correlativo = req.params.id;

        const affectedRows = await reciboModel.deleteReciboById(Correlativo);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Recibo no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Recibo eliminado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el Recibo', 500);
    }
}

/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UN ITEM POR PRODUCTOID
 *****************************************************************************************************/
async function deleteItemReciboById(req, res) {
    try {
        const Id = req.params.id;

        const affectedRows = await reciboModel.deleteItemReciboById(Id);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Servicio no encontrado', 404);
        } else {
            respuesta.success(req, res, { ensaje: 'Item eliminado con éxito', affectedRows }, 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el Recibo', 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA EDITAR UN RECIBO POR SU ID
 *****************************************************************************************************/
async function updateReciboById(req, res) {
    try {
        const Id = req.params.id;
        const updatedServicioData = req.body;
        const correlat = await reciboModel.updateReciboById(Id, updatedServicioData);
        if (correlat === 0) {
            respuesta.NotFound(req, res, 'Recibo no encontrado', 404);
        } else {
            respuesta.success(req, res, { mensaje: 'Recibo actualizado con éxito', correlat }, 200);
        }
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA BUSCAR POR NOMBRE
//  *****************************************************************************************************/
async function getAllRecibosByName(req, res) {
    const name = req.params.name
    try {
        const nombres = await reciboModel.getAllRecibosByName(name);
        respuesta.success(req, res, nombres, 200)
    } catch (error) {
        
        respuesta.error(req, res, error, 500)
    }
}



module.exports = {
    getAllRecibos,
    getRecibobyId,
    createRecibo,
    deleteReciboById,
    updateReciboById,
    getReciboPDF,
    deleteItemReciboById,
    getAllRecibosByName,
    payment,
    validateReciboByCodigo,
    getReciboPDFbyCodigo
};
