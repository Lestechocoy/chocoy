// NotaController.js

const tramitesModel = require('../modelos/tramites');
const respuesta = require('../Helpers/respuestas');

/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS TRAMITES
//  *****************************************************************************************************/
async function getAllTramites(req, res) {
    try {
        const Notas = await tramitesModel.getAllTramites();
        respuesta.success(req, res, Notas, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500)
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN TRAMITE POR SU ID
 *****************************************************************************************************/
async function getTramiteById(req, res) {
    try {
        const Id = req.params.id; // Se espera que el ID del NOTA esté en los parámetros de la URL
        const tramites = await tramitesModel.getTramitebyId(Id);
        if (!tramites) {
            return respuesta.NotFound(res, req, 'NOTA no encontrado', 400)
        }
        respuesta.success(req, res, tramites, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA CREAR UN NUEVO TRAMITE
 ******************************************************************************************************/
async function createTramite(req, res) {
    const { clienteData, servicioData } = req.body; // Supongamos que los datos se envían como un objeto con dos propiedades: clienteData y reciboData
    try {
        const result = await tramitesModel.createTramite(clienteData, servicioData); // Llama a la función createRecibo con los datos del cliente y recibo
        respuesta.success(req, res, { message: 'Registro exitoso', result }, 200);
        console.log(result)
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA EDITAR UN RECIBO POR SU ID
 *****************************************************************************************************/
async function updateTramiteById(req, res) {
    try {
        const IdCliente = req.params.id;
        const updatedTramiteData = req.body;
        const result = await tramitesModel.updateTramiteById(IdCliente, updatedTramiteData);
        if (!result) {
            respuesta.NotFound(req, res, 'Recibo no encontrado', 404);
        } else {
            respuesta.success(req, res, { mensaje: 'Recibo actualizado con éxito', result }, 200);
        }
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}

/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UN ITEM POR TRAMITE-ID
 *****************************************************************************************************/
async function deleteItemTramiteById(req, res) {
    try {
        const Id = req.params.id;

        const affectedRows = await tramitesModel.deleteItemTramiteById(Id);

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
                 CONTROLADOR PARA ELIMINAR UN TRAMITE POR SU ID
 *****************************************************************************************************/
async function deleteTramiteById(req, res) {
    try {
        const Id = req.params.id; // Se espera que el ID del NOTA esté en los parámetros de la URL

        const affectedRows = await tramitesModel.deleteTramiteById(Id);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Tramite no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Tramite eliminado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el Tramite', 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA BUSCAR POR NOMBRE
//  *****************************************************************************************************/
async function getAllTramiteByName(req, res) {
    const name = req.params.name
    try {
        const nombres = await tramitesModel.getAllTramitesByName(name);
        respuesta.success(req, res, nombres, 200)
    } catch (error) {

        respuesta.error(req, res, error, 500)
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN TRAMITE POR SU ID
 *****************************************************************************************************/
                 async function getEstadoTramiteByCodigo(req, res) {
                    try {
                        const codigo = req.params.cui; // Se espera que el ID del NOTA esté en los parámetros de la URL
                        const estado = await tramitesModel.getEstadoTramitebyCodigo(codigo)
                        if (!estado) {
                            return respuesta.NotFound(res, req, 'NOTA no encontrado', 400)
                        }
                        respuesta.success(req, res, estado, 200);
                    } catch (error) {
                        respuesta.error(req, res, error, 500);
                    }
                }
// Exporta los controladores para que puedan ser utilizados en las rutas de Express
module.exports = {
    getAllTramites,
    createTramite,
    getTramiteById,
    deleteTramiteById,
    updateTramiteById,
    getAllTramiteByName,
    deleteItemTramiteById,
    getEstadoTramiteByCodigo

};
