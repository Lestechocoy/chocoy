const mysqlConnection = require('../../config/mysql');
const { encrypt, compare } = require('../Helpers/HandleBcrypt')


/******************************************************************************************************
                 FUNCION PARA OBTENER TODOS LOS USUARIOS DE LA BASE DE DATOS
 *****************************************************************************************************/
async function getAllUsers() {
    try {
        const rows = await mysqlConnection.query('SELECT * FROM usuario');
        return rows;
    } catch (error) {
        throw error;
    }
}



/******************************************************************************************************
                 FUNCION PARA OBTENER UN USUARIO POR SU ID
 *****************************************************************************************************/
async function getUserById(userId) {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT * FROM usuario WHERE Id = ?';

        try {
            const results = await mysqlConnection.query(query, [userId]);

            if (results.length === 0) {
                resolve(null);
            } else {
                const user = results[0];
                resolve(user);
            }
        } catch (error) {
            reject(error);
        }
    });
}


/******************************************************************************************************
                 FUNCION PARA CREAR UN USUARIO
 *****************************************************************************************************/

async function createUser(newUser) {
    return new Promise(async (resolve, reject) => {
        const {Nombre, Apellido, Usuario, Correo, Telefono, Direccion} = newUser;
        
        try {
            // Verifica si el usuario ya existe en la base de datos
            const existingUserQuery = 'SELECT Usuario FROM usuario WHERE Usuario = ?';
            const existingUser = await mysqlConnection.query(existingUserQuery, [Usuario]);

            if (existingUser.length > 0) {
                // El usuario ya existe
                reject('El usuario ya existe en la base de datos');
            } else {

                // Definir los valores para otros campos (Foto, Rol, etc.) según tus necesidades
                const Foto = 'fotoderecuerdo';
                const Rol = 'admin';
                const Contrasena = '123456'
                const passwordHash = await encrypt(Contrasena);
                // Consulta SQL para insertar el nuevo usuario en la base de datos
                const insertUserQuery = 'INSERT INTO usuario (Usuario, Contrasena, PrimerNombre, PrimerApellido, Correo, Telefono, Direccion, Foto, Rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

                const results = await mysqlConnection.query(insertUserQuery, [Usuario, passwordHash, Nombre, Apellido, Correo, Telefono, Direccion, Foto, Rol]);

                // Devuelve el ID del nuevo usuario
                resolve(results.insertId);
            }
        } catch (error) {
            reject(error);
        }
    });
}




/******************************************************************************************************
                 FUNCION PARA ELIMINAR UN USUARIO POR SU ID
 *****************************************************************************************************/
async function deleteUserById(userId) {
    return new Promise(async (resolve, reject) => {
        const query = 'DELETE FROM usuario WHERE id = ?';

        try {
            const results = await mysqlConnection.query(query, [userId]);
            // Devuelve el número de filas eliminadas (debería ser 1 si se eliminó correctamente)
            resolve(results.affectedRows);
        } catch (error) {
            reject(error);
        }
    });
}




/******************************************************************************************************
                 FUNCION PARA EDITAR UN USUARIO POR SU ID
 *****************************************************************************************************/
async function updateUserById(userId, updatedUserData) {
    try {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE usuario SET Usuario = ?, PrimerNombre = ?, PrimerApellido = ?, Correo= ?, Telefono= ? WHERE Id = ?';
            const { Nombre,Apellido, Usuario, Email, Telefono } = updatedUserData;

            mysqlConnection.query(query, [Usuario, Nombre, Apellido, Email, Telefono, userId], (error, results) => {
                if (error) {
                    reject(error);
                }
                // Devuelve el número de filas actualizadas (debería ser 1 si se actualizó correctamente)
                resolve(results.affectedRows);
            });
        });
    } catch (error) {
        throw error;
    }
}





// Exporta las funciones del modelo para que puedan ser utilizadas en otros módulos
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    updateUserById,
};





