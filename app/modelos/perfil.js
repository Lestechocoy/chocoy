const mysqlConnection = require('../../config/mysql');
const { encrypt, compare } = require('../Helpers/HandleBcrypt');
const fs = require('fs');
const path = require('path');


/******************************************************************************************************
                 ACTUALIZAR LA RUTA DE LA FOTO EN L ABASE DE DATOS
 *****************************************************************************************************/

async function updateFotoPerfil(Id, nombreImagen) {
    try {
        const queryFotoAntigua = "SELECT Foto FROM usuario WHERE Id = ?";
        const resultFoto = await mysqlConnection.query(queryFotoAntigua, [Id]);
        const imagen = resultFoto[0].Foto;
        if (resultFoto.length > 0) {

            const rutaImagenAntigua = path.join(__dirname, '../../assets/img', imagen);
            eliminarImagen(rutaImagenAntigua);

            const query = 'UPDATE usuario SET Foto = ? WHERE Id = ?';
            const results = await mysqlConnection.query(query, [nombreImagen, Id]);
            console.log('Resultado de la consulta UPDATE:', results);
            return results.affectedRows; // Devuelve el número de filas actualizadas
        } else {
            throw new Error('No se encontró ningún usuario con ese ID.');
        }
    } catch (error) {
        throw error;
    }
}




function eliminarImagen(Imagen) {
    try {
        // Comprobar si la imagen existe antes de intentar eliminarla
        if (fs.existsSync(Imagen)) {
            // Eliminar la imagen físicamente
            fs.unlinkSync(Imagen);
            console.log('La imagen fue eliminada correctamente.');
        } else {
            console.log('La imagen no existe en la ruta especificada.');
        }
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        throw error;
    }
}



/******************************************************************************************************
                 CAMBIAR LA CONTRASEÑA
 *****************************************************************************************************/
async function cambiarPassword(id, newPass) {
    return new Promise(async (resolve, reject) => {
        try {
            const passwordHash = await encrypt(newPass);
            const queryPass = "UPDATE usuario SET Contrasena = ? WHERE Id = ?";

            mysqlConnection.query(queryPass, [passwordHash, id], (err, resultPass) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(resultPass);
                }
            });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}



module.exports = {
    updateFotoPerfil,
    cambiarPassword
};