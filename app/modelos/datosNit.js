//datosNit modelo
const mysqlConnection = require('../../config/mysql');



/******************************************************************************************************
                 FUNCION PARA OBTENER TODOS LOS USUARIOS DE LA BASE DE DATOS
 *****************************************************************************************************/
async function getAllDatos() {
    try {
        const rows = await mysqlConnection.query('SELECT * FROM datosnit ORDER BY Id DESC');
        return rows;
    } catch (error) {
        throw error;
    }
}



/******************************************************************************************************
                 FUNCION PARA OBTENER UN USUARIO POR SU ID
 *****************************************************************************************************/
async function getUserById(Id) {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT * FROM datosnit WHERE Id = ?';

        try {
            const results = await mysqlConnection.query(query, [Id]);

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
                 FUNCION PARA OBTENER UN USUARIO POR SU NOMBRE
 *****************************************************************************************************/

async function filterClientByName(name) {
    const query = 'SELECT * FROM datosnit WHERE Nombre LIKE ?';
    try {
        const rows = await mysqlConnection.query(query, [`%${name}%`]);
        return rows;
    } catch (error) {
        console.error("Error al obtener los recibos por nombre:", error);
        throw error;
    }
}


/******************************************************************************************************
                 FUNCION PARA CREAR UN USUARIO
 *****************************************************************************************************/

async function createClient(newClient) {
    return new Promise(async (resolve, reject) => {
        const { Nombre, Cui, Nit, Correo, passEmail, passAV, FechaNac, Telefono, Direccion } = newClient;

        try {
            // Consulta SQL para insertar el nuevo usuario en la base de datos
            const insertClientQuery = 'INSERT INTO datosnit (Nombre, Cui, Nit, Correo, Contrasena_Correo, Contrasena_AV, Fecha_Nac, Telefono, Residencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const results = await mysqlConnection.query(insertClientQuery, [Nombre, Cui, Nit, Correo, passEmail, passAV, FechaNac, Telefono, Direccion]);
            // Devuelve el ID del nuevo usuario
            resolve(results.insertId);
        } catch (error) {
            reject(error);
        }
    });
}




/******************************************************************************************************
                 FUNCION PARA ELIMINAR UN CLIENTE POR SU ID
 *****************************************************************************************************/
async function deleteClienteById(clientId) {
    return new Promise(async (resolve, reject) => {
        const query = 'DELETE FROM datosnit WHERE id = ?';

        try {
            const results = await mysqlConnection.query(query, [clientId]);
            // Devuelve el número de filas eliminadas (debería ser 1 si se eliminó correctamente)
            resolve(results.affectedRows);
        } catch (error) {
            reject(error);
        }
    });
}




/******************************************************************************************************
                 FUNCION PARA EDITAR DATOS DE UN CLIENTE POR SU ID
 *****************************************************************************************************/
async function updateClienteById(clientId, updatedClienteData) {
    try {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE datosnit SET Nombre = ?, Cui = ?, Nit = ?, Correo = ?, Contrasena_Correo = ?, Contrasena_AV = ?, Fecha_Nac= ?, Telefono= ?, Residencia = ? WHERE Id = ?';
            const { Nombre, Cui, Nit, Email, passEmail, passAV, FechaNac, Telefono, Residencia } = updatedClienteData;

            mysqlConnection.query(query, [Nombre, Cui, Nit, Email, passEmail, passAV, FechaNac, Telefono, Residencia, clientId], (error, results) => {
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
    getAllDatos,
    getUserById,
    createClient,
    deleteClienteById,
    updateClienteById,
    filterClientByName

};





