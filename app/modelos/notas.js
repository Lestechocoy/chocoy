const mysqlConnection = require('../../config/mysql');
const { encrypt, compare } = require('../Helpers/HandleBcrypt')


/******************************************************************************************************
                 FUNCION PARA OBTENER TODAS LAS NOTAS DE LA BASE DE DATOS
 *****************************************************************************************************/
async function getAllNotas() {
    try {
        const rows = await mysqlConnection.query('SELECT * FROM notas ORDER BY Id DESC');
        return rows;
    } catch (error) {
        throw error;
    }
}



/******************************************************************************************************
                 FUNCION PARA OBTENER UNA NOTA POR SU ID
 *****************************************************************************************************/
async function getNotasById(Id) {
    return new Promise(async (resolve, reject) => {
        const query = 'SELECT * FROM notas WHERE Id = ?';

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
                 FUNCION PARA CREAR UNA NOTA
 *****************************************************************************************************/

async function createNota(newNota) {
    return new Promise(async (resolve, reject) => {
        const { Nombre, Descripcion } = newNota;

        try {

            // Consulta SQL para insertar el nuevo usuario en la base de datos
            const insertUserQuery = 'INSERT INTO notas (Nombre, Descripcion) VALUES (?, ?)';

            const results = await mysqlConnection.query(insertUserQuery, [Nombre, Descripcion]);
            resolve(results.insertId);
        }
        catch (error) {
            reject(error);
        }
    })

}





/******************************************************************************************************
                 FUNCION PARA ELIMINAR UNA NOTA POR SU ID
 *****************************************************************************************************/
async function deleteNotaById(userId) {
    return new Promise(async (resolve, reject) => {
        const query = 'DELETE FROM notas WHERE id = ?';

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
                 FUNCION PARA EDITAR UNA NOTA POR SU ID
 *****************************************************************************************************/
async function updateNotaById(Id, updatedNotaData) {
    try {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE notas SET Nombre = ?, Descripcion = ? WHERE Id = ?';
            const { Nombre, Descripcion } = updatedNotaData;

            mysqlConnection.query(query, [Nombre, Descripcion, Id], (error, results) => {
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


/******************************************************************************************************
                 FUNCION PARA CONSULTAR NOMBRES EN TIEMPO REAL
 *****************************************************************************************************/
async function getAllNotasByName(name) {
    //const queryRecibos = "SELECT c.NombreCliente, c.Direccion, f.Correlativo, f.Fecha, f.Estado, f.Saldo FROM clientes c INNER JOIN factura f ON c.Id = f.IdCliente WHERE c.NombreCliente LIKE ?";
    const queryNotas = `SELECT * FROM notas WHERE Nombre LIKE ?`;
    try {
        const rows = await mysqlConnection.query(queryNotas, [`%${name}%`]);
        return rows;
    } catch (error) {
        console.error("Error al obtener los recibos por nombre:", error);
        throw error;
    }
}



// Exporta las funciones del modelo para que puedan ser utilizadas en otros módulos
module.exports = {
    getAllNotas,
    getNotasById,
    createNota,
    deleteNotaById,
    updateNotaById,
    getAllNotasByName
};





