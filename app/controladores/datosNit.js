// datosNit Controller.js

const datosNitModel = require('../modelos/datosNit');
const respuesta = require('../Helpers/respuestas');


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS USUARIOS
//  *****************************************************************************************************/
async function getAllDatos(req, res) {
    try {

        const datos = await datosNitModel.getAllDatos();
        respuesta.success(req, res, datos, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500)
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN USUARIO POR SU ID
 *****************************************************************************************************/
async function getUserById(req, res) {
    try {
        const userId = req.params.id; // Se espera que el ID del usuario esté en los parámetros de la URL
        const user = await datosNitModel.getUserById(userId);
        if (!user) {
            return respuesta.NotFound(res, req, 'Usuario no encontrado', 400)
        }
        respuesta.success(req, res, user, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN USUARIO POR SU NOMBRE
 *****************************************************************************************************/
async function filterClientByName(req, res) {
    try {
        const name = req.params.name;

        const nombres = await datosNitModel.filterClientByName(name);
        
        if (!nombres) {
            return respuesta.NotFound(res, req, 'Usuario no encontrado', 400)
        }
        respuesta.success(req, res, nombres, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA CREAR UN USUARIO NUEVO
 ******************************************************************************************************/
async function createClient(req, res) {
    const newClient = req.body;
    try {
        // Intenta crear el usuario
        const userId = await datosNitModel.createClient(newClient);
        respuesta.success(req, res, { message: 'Usuario creado con éxito', userId }, 200);
    } catch (error) {
        if (error === 'El usuario ya existe en la base de datos') {
            // El usuario ya existe, devuelve un mensaje apropiado
            respuesta.error(req, res, { mensaje: 'El usuario ya existe' }, 400); // Código de estado 400 para indicar una solicitud incorrecta
        } else {
            // Otro error, devuelve un mensaje genérico de error
            respuesta.error(req, res, 'Error al crear el usuario', 500); // Código de estado 500 para errores del servidor
        }
    }
}




/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UN CLIENTE POR SU ID
 *****************************************************************************************************/
async function deleteClienteById(req, res) {
    try {
        const clienteId = req.params.id; // Se espera que el ID del usuario esté en los parámetros de la URL

        const affectedRows = await datosNitModel.deleteClienteById(clienteId);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'cliente no encontrado', 404);
        } else {
            respuesta.success(req, res, 'cliente eliminado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el cliente', 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA EDITAR DATOS DE UN CLIENTE POR SU ID
 *****************************************************************************************************/
async function updateClienteById(req, res) {
    try {
        const userId = req.params.id;
        const updateClienteData = req.body;

        const affectedRows = await datosNitModel.updateClienteById(userId, updateClienteData);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Usuario no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Usuario actualizado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al actualizar el usuario', 500);
    }
}






// Exporta los controladores para que puedan ser utilizados en las rutas de Express
module.exports = {
    getAllDatos,
    getUserById,
    createClient,
    deleteClienteById,
    updateClienteById,
    filterClientByName

};
