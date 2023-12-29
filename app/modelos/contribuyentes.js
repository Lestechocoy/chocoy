//contribuyentes modelo
const mysqlConnection = require('../../config/mysql');



/******************************************************************************************************
                 FUNCION PARA OBTENER TODOS LOS USUARIOS DE LA BASE DE DATOS
 *****************************************************************************************************/
async function getAllContribuyentes() {
    try {
        const rows = await mysqlConnection.query('SELECT * FROM contribuyentes ORDER BY Id DESC');
        return rows;
    } catch (error) {
        throw error;
    }
}

/******************************************************************************************************
                 FUNCION PARA OBTENER TODOS LOS CONTRIBUYENTES Y SU CONTABILIDAD
 *****************************************************************************************************/
async function getContabilidadContribuyentes() {
    try {
        const rows = await mysqlConnection.query(`SELECT c.Nombre, c.Id, ct.MesImpuesto, ct.MesHonorario, ct.ImpuestoTotal, ct.Estado
                        FROM contribuyentes AS c
                        LEFT JOIN contabilidad_contribuyentes AS ct ON c.Id = ct.IdContribuyente;`);
        return rows;
    } catch (error) {
        throw error;
    }
}


/******************************************************************************************************
                 FUNCION PARA OBTENER UN CONTRIBUYENTE POR SU NOMBRE
 *****************************************************************************************************/

async function filterContribuyenteByName(name) {
    const query = 'SELECT * FROM contribuyentes WHERE Nombre LIKE ?';
    try {
        const rows = await mysqlConnection.query(query, [`%${name}%`]);
        return rows;
    } catch (error) {
        console.error("Error al obtener los recibos por nombre:", error);
        throw error;
    }
}

/******************************************************************************************************
                 FUNCION PARA FILTRAR LA CONTABILIDAD DE LOS CONTRIBUYENTES
 *****************************************************************************************************/

async function filterContabilidadByName(name) {
    const query = `SELECT c.Nombre, c.Id, ct.MesImpuesto, ct.MesHonorario, ct.ImpuestoTotal, ct.Estado
                    FROM contribuyentes AS c
                    LEFT JOIN contabilidad_contribuyentes AS ct ON c.Id = ct.IdContribuyente WHERE c.Nombre LIKE ?`;
    try {
        const rows = await mysqlConnection.query(query, [`%${name}%`]);
        return rows;
    } catch (error) {
        console.error("Error al obtener los recibos por nombre:", error);
        throw error;
    }
}
/******************************************************************************************************
 FUNCION PARA OBTENER TODOS LOS CONTRIBUYENTES POR SU ID Y SU CONTABILIDAD
*****************************************************************************************************/
async function getContabilidadContribuyenteById(Id) {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT c.Nombre, c.Id, ct.MesImpuesto, ct.MesHonorario, ct.ImpuestoTotal, ct.Estado
        FROM contribuyentes AS c
        LEFT JOIN contabilidad_contribuyentes AS ct ON c.Id = ct.IdContribuyente WHERE c.Id = ?`;

        try {
            const results = await mysqlConnection.query(query, [Id]);

            if (results.length === 0) {
                resolve(null);
            } else {
                const contribuyente = results[0];
                resolve(contribuyente);
            }
        } catch (error) {
            reject(error);
        }
    });
}

/******************************************************************************************************
                 FUNCION PARA OBTENER UN CONTRIBUYENTE POR SU ID
 *****************************************************************************************************/
async function getContribuyenteById(Id) {

    return new Promise(async (resolve, reject) => {
        const query = 'SELECT * FROM contribuyentes WHERE Id = ?';

        try {
            const results = await mysqlConnection.query(query, [Id]);

            if (results.length === 0) {
                resolve(null);
            } else {
                const contribuyente = results[0];
                resolve(contribuyente);
            }
        } catch (error) {
            reject(error);
        }
    });
}


/******************************************************************************************************
                 FUNCION PARA CREAR UN CONTRIBUYENTE
 *****************************************************************************************************/

async function createContribuyente(newContribuyente) {
    return new Promise(async (resolve, reject) => {
        const { Nombre, Cui, Nit, Telefono, Direccion } = newContribuyente;

        try {
            const insertQuery = 'INSERT INTO contribuyentes (Nombre, Cui, Nit, Telefono, Direccion) VALUES (?, ?, ?, ?, ?)';
            const results = await mysqlConnection.query(insertQuery, [Nombre, Cui, Nit, Telefono, Direccion]);
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
async function deleteContribuyenteById(contrId) {
    return new Promise(async (resolve, reject) => {
        const query = 'DELETE FROM contribuyentes WHERE id = ?';

        try {
            const results = await mysqlConnection.query(query, [contrId]);
            // Devuelve el número de filas eliminadas (debería ser 1 si se eliminó correctamente)
            resolve(results.affectedRows);
        } catch (error) {
            reject(error);
        }
    });
}




/******************************************************************************************************
                 FUNCION PARA EDITAR DATOS DE UN CONTRIBUYENTE POR SU ID
 *****************************************************************************************************/
async function updateContribuyenteById(contrId, updatedContribuyenteData) {
    try {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE contribuyentes SET Nombre = ?, Cui = ?, Nit = ?, Telefono= ?, Direccion = ? WHERE Id = ?';
            const { Nombre, Cui, Nit, Telefono, Direccion } = updatedContribuyenteData;

            mysqlConnection.query(query, [Nombre, Cui, Nit, Telefono, Direccion, contrId], (error, results) => {
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
                 FUNCION PARA EDITAR CONTABILIDAD DE UN CONTRIBUYENTE POR SU ID
 *****************************************************************************************************/
async function updateContabilidadContribuyenteById(contrId, updatedContabilidadData) {
    return new Promise((resolve, reject) => {
        try {
            const selectQuery = 'SELECT * FROM contabilidad_contribuyentes WHERE IdContribuyente = ?';
            const { Mes, Honorario, Total, Estado } = updatedContabilidadData;

            // Realiza una consulta para verificar si el registro ya existe
            mysqlConnection.query(selectQuery, [contrId], (selectError, selectResults) => {
                if (selectError) {
                    reject(selectError);
                } else if (selectResults.length === 0) {
                    // Si el registro no existe, realiza una inserción
                    const insertQuery = 'INSERT INTO contabilidad_contribuyentes (IdContribuyente, MesImpuesto, MesHonorario, ImpuestoTotal, Estado) VALUES (?, ?, ?, ?, ?)';
                    mysqlConnection.query(insertQuery, [contrId, Mes, Honorario, Total, Estado], (insertError, insertResults) => {
                        if (insertError) {
                            reject(insertError);
                        } else {
                            // Devuelve el número de filas insertadas (debería ser 1 si se insertó correctamente)
                            resolve(insertResults.affectedRows);
                        }
                    });
                } else {
                    // El registro ya existe, actualiza los valores
                    const updateQuery = 'UPDATE contabilidad_contribuyentes SET MesImpuesto = ?, MesHonorario = ?, ImpuestoTotal = ?, Estado = ? WHERE IdContribuyente = ?';
                    mysqlConnection.query(updateQuery, [Mes, Honorario, Total, Estado, contrId], (updateError, updateResults) => {
                        if (updateError) {
                            reject(updateError);
                        } else {
                            // Devuelve el número de filas actualizadas (debería ser 1 si se actualizó correctamente)
                            resolve(updateResults.affectedRows);
                        }
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}





// Exporta las funciones del modelo para que puedan ser utilizadas en otros módulos
module.exports = {
    getAllContribuyentes,
    getContribuyenteById,
    createContribuyente,
    deleteContribuyenteById,
    updateContribuyenteById,
    getContabilidadContribuyentes,
    getContabilidadContribuyenteById,
    updateContabilidadContribuyenteById,
    filterContribuyenteByName,
    filterContabilidadByName

};





