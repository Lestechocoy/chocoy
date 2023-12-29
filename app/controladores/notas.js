// NotaController.js

const notasModel = require('../modelos/notas');
const respuesta = require('../Helpers/respuestas');

/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS NOTAS
//  *****************************************************************************************************/
async function getAllNotas(req, res) {
    try {
        const Notas = await notasModel.getAllNotas();
        respuesta.success(req, res, Notas, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500)
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN NOTA POR SU ID
 *****************************************************************************************************/
async function getNotaById(req, res) {
    try {
        const NotaId = req.params.id; // Se espera que el ID del NOTA esté en los parámetros de la URL
        const Nota = await notasModel.getNotasById(NotaId);
        if (!Nota) {
            return respuesta.NotFound(res, req, 'NOTA no encontrado', 400)
        }
        console.log(NotaId)
        respuesta.success(req, res, Nota, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA CREAR UN NOTA NUEVO
 ******************************************************************************************************/
async function createNota(req, res) {
    const newNota = req.body;

    try {

        // Intenta crear el NOTA
       const NotaId = await notasModel.createNota(newNota);
        respuesta.success(req, res, NotaId, 200);
    } catch (error) {
        if (error === 'El NOTA ya existe en la base de datos') {
            // El NOTA ya existe, devuelve un mensaje apropiado
            respuesta.error(req, res, {mensaje : 'El NOTA ya existe'}, 400); // Código de estado 400 para indicar una solicitud incorrecta
        } else {
            // Otro error, devuelve un mensaje genérico de error
            respuesta.error(req, res, 'Error al crear el NOTA', 500); // Código de estado 500 para errores del servidor
        }
    }
}




/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UNA NOTA POR SU ID
 *****************************************************************************************************/
async function deleteNotaById(req, res) {
    try {
        const NotaId = req.params.id; // Se espera que el ID del NOTA esté en los parámetros de la URL

        const affectedRows = await notasModel.deleteNotaById(NotaId);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'NOTA no encontrado', 404);
        } else {
            respuesta.success(req, res, 'NOTA eliminado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el NOTA', 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA EDITAR UNA NOTA POR SU ID
 *****************************************************************************************************/
async function updateNotaById(req, res) {
    try {
        const NotaId = req.params.id;
        const updatedNotaData = req.body;

        const affectedRows = await notasModel.updateNotaById(NotaId, updatedNotaData);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'NOTA no encontrado', 404);
        } else {
            respuesta.success(req, res, 'NOTA actualizado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al actualizar el NOTA', 500);
    }
}

/******************************************************************************************************
                 CONTROLADOR PARA BUSCAR POR NOMBRE
//  *****************************************************************************************************/
async function getAllNotasByName(req, res) {
    const name = req.params.name
    console.log(name)
    try {
        const nombres = await notasModel.getAllNotasByName(name);
        respuesta.success(req, res, nombres, 200)
    } catch (error) {
        
        respuesta.error(req, res, error, 500)
    }
}




// Exporta los controladores para que puedan ser utilizados en las rutas de Express
module.exports = {
    getAllNotas,
    getNotaById,
    createNota,
    deleteNotaById,
    updateNotaById,
    getAllNotasByName

};
