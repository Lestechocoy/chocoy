// userController.js

const userModel = require('../modelos/usuarios');
const respuesta = require('../Helpers/respuestas');

/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS USUARIOS
//  *****************************************************************************************************/
async function getAllUsers(req, res) {
    try {
        const users = await userModel.getAllUsers();
        respuesta.success(req, res, users, 200)
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
        const user = await userModel.getUserById(userId);
        if (!user) {
            return respuesta.NotFound(res, req, 'Usuario no encontrado', 400)
        }
        respuesta.success(req, res, user, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA CREAR UN USUARIO NUEVO
 ******************************************************************************************************/
async function createUser(req, res) {
    const newUser = req.body;

    try {
        // Intenta crear el usuario
        const userId = await userModel.createUser(newUser);
        respuesta.success(req, res, { message: 'Usuario creado con éxito', userId }, 200);
    } catch (error) {
        if (error === 'El usuario ya existe en la base de datos') {
            // El usuario ya existe, devuelve un mensaje apropiado
            respuesta.error(req, res, {mensaje : 'El usuario ya existe'}, 400); // Código de estado 400 para indicar una solicitud incorrecta
        } else {
            // Otro error, devuelve un mensaje genérico de error
            respuesta.error(req, res, 'Error al crear el usuario', 500); // Código de estado 500 para errores del servidor
        }
    }
}




/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UN USUARIO POR SU ID
 *****************************************************************************************************/
async function deleteUserById(req, res) {
    try {
        const userId = req.params.id; // Se espera que el ID del usuario esté en los parámetros de la URL

        const affectedRows = await userModel.deleteUserById(userId);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Usuario no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Usuario eliminado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el usuario', 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA EDITAR UN USUARIO POR SU ID
 *****************************************************************************************************/
async function updateUserById(req, res) {
    try {
        const userId = req.params.id;
        const updatedUserData = req.body;

        const affectedRows = await userModel.updateUserById(userId, updatedUserData);

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
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    updateUserById,

};
