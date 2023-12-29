const mysqlConnection = require('../../config/mysql');
const { encrypt, compare } = require('../Helpers/HandleBcrypt');
const { pool } = require('../../config/mysql');



/******************************************************************************************************
                 AUTENTICAR USUARIOS (INICIAR SESION)
 *****************************************************************************************************/
async function authUser(credenciales) {
    try {
        const { username, password } = credenciales;
        const userQueryResult = await findUserByUsername(username);

        if (userQueryResult.length > 0) {
            const pass = userQueryResult[0].Contrasena;

            // Compara la contraseña proporcionada con la contraseña almacenada de manera segura
            const passwordMatch = await compare(password, pass);

            if (passwordMatch) {
                // Contraseña válida
                return { credenciales: userQueryResult[0] };
            } else {
                // Contraseña incorrecta
                return false;
            }
        } else {
            // Usuario no encontrado
            return false;
        }
    } catch (error) {
        throw error;
    }
}
// async function authUser(credenciales) {

//     try {
//         const { username, password } = credenciales;
//         const query = 'SELECT * FROM usuario WHERE Usuario = ?';
//         const userQueryResult = await pool.query(query, [username]);
// console.log(userQueryResult)
//         if (userQueryResult.length > 0) {
//             const storedPassword = userQueryResult[0].password;

//             // Verificar la contraseña proporcionada con la contraseña almacenada en la base de datos
//             if (password === storedPassword) {
//                 // Contraseña válida
//                 return { credenciales: userQueryResult[0] };
//             } else {
//                 // Contraseña incorrecta
//                 return false;
//             }
//         } else {
//             // Usuario no encontrado
//             return false;
//         }
//     } catch (error) {
//         throw error;
//     }
// }


/******************************************************************************************************
                 CONSULTAR USUARIO BYUSERNAME
 *****************************************************************************************************/
async function findUserByUsername(username) {
    try {
        const queryUser = "SELECT * FROM usuario WHERE Usuario = ?";
        const userQueryResult = await new Promise((resolve, reject) => {
            mysqlConnection.query(queryUser, [username], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return userQueryResult;
    } catch (error) {
        throw error;
    }
}


/******************************************************************************************************
                Obtner los datos del usuario al iniciar sesion y mostrarlo en la pagina
 *****************************************************************************************************/
                 async function findUserById(id) {
                    try {
                        const queryUser = "SELECT Id, PrimerNombre, PrimerApellido, Correo,Telefono, Direccion, Foto, Rol FROM usuario WHERE Id = ?";
                        const userQueryResult = await new Promise((resolve, reject) => {
                            mysqlConnection.query(queryUser, [id], (error, results) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(results);
                                }
                            });
                        });
                        return userQueryResult;
                    } catch (error) {
                        throw error;
                    }
                }
                
module.exports = {
    authUser,
    findUserById
};                