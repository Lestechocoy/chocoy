// userController.js
const perfilModel = require('../modelos/perfil');
const respuesta = require('../Helpers/respuestas');




/*======================================================================
                Actualizar Fot de perfil
=======================================================================*/


async function updateFotoPerfil(req, res) {
    try {
        const id = req.params.id; // Obtener el ID del parámetro de la ruta
        const imagen = req.file; // Archivo de imagen enviado desde el frontend

        if (!imagen) {
            return res.status(400).json({ error: 'No se ha subido ninguna imagen.' });
        }

        
        // Aquí puedes obtener el nombre y la ruta temporal del archivo subido
        const nombreArchivo = imagen.filename; // Nombre del archivo
        const rutaTemporal = imagen.path; // Ruta temporal del archivo

        // ... Continuar con el procesamiento o almacenamiento de la imagen ...
        
        // Ejemplo de cómo usar la función para actualizar la foto del perfil en la base de datos
        const updateFoto = await perfilModel.updateFotoPerfil(id, nombreArchivo);

        respuesta.success(req, res, updateFoto, 200)
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        res.status(500).json({ error: 'Hubo un problema al procesar la imagen.' });
    }
}


 
/*======================================================================
               cambiar la contraseña del usuario
=======================================================================*/
async function cambiarPassword(req, res) {
    try {
        const id = req.params.id;

        const newPass = req.body.newPass;
        const affectedRows = await perfilModel.cambiarPassword(id,newPass);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Usuario no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Usuario actualizado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al actualizar el Usuario', 500);
    }
}



module.exports = {
    updateFotoPerfil,
    cambiarPassword
};