const mysqlConnection = require('../../config/mysql');
const {codigoRecibo} = require('../Helpers/RandomText');
const { error } = require('../Helpers/respuestas');
/******************************************************************************************************
                 FUNCION PARA OBTENER TODOS LOS SERVICIOS PENDIENTES DE PAGOS
 *****************************************************************************************************/
async function getAllRecibos() {
    const queryRecibos = `SELECT cc.NombreCliente,
                                    cc.Direccion,
                                    cc.Telefono, 
                                    rc.Correlativo, 
                                    rc.Fecha, 
                                    rc.Estado, 
                                    rc.Anticipo, 
                                    rc.Saldo, 
                            SUM(ds.PrecioTotal) AS Total 
                            FROM 
                                clientes cc 
                            INNER JOIN recibos rc ON cc.Id = rc.IdCliente 
                            LEFT JOIN detalles_recibos ds ON rc.Id = ds.ComprobanteId 
                            GROUP BY cc.NombreCliente, cc.Direccion, rc.Correlativo, rc.Fecha, rc.Estado, rc.Anticipo, rc.Saldo ORDER BY rc.Correlativo DESC;`;
    try {
        const rows = await mysqlConnection.query(queryRecibos);
        return rows;
    } catch (error) {
        throw error;
    }
}
/******************************************************************************************************
                 FUNCION PARA BTENER DETALLES DE UN RECIBO EN PARA GENERAR EL PDF
 *****************************************************************************************************/
async function getReciboPDF(ReciboId) {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT 
                            cc.NombreCliente,
                            cc.Direccion, cc.Telefono,
                            rc.Correlativo,
                            rc.CodigoRecibo,
                            rc.Fecha, rc.Hora,
                            rc.Estado,
                            rc.Anticipo,
                            rc.Saldo,
                            ds.Detalles_Servicios,
                            ds.Cantidad,
                            ds.PrecioUnitario,
                            ds.PrecioTotal,
                            ds.ComprobanteId
                        FROM clientes cc 
                        INNER JOIN recibos rc ON cc.Id = rc.IdCliente 
                        INNER JOIN detalles_recibos ds ON rc.Id = ds.ComprobanteId 
                        WHERE rc.Correlativo = ?;`;
        try {
            const rows = await mysqlConnection.query(query, [ReciboId]);
            if (rows.length === 0) {
                return null;
            }
            // Extraer datos del cliente
            const clienteInfo = {
                NombreCliente: rows[0].NombreCliente || null,
                DireccionCliente: rows[0].Direccion || null,
                TelefonoCliente: rows[0].Telefono || null,
            };
            // Extraer datos del recibo
            const FacturaDetalle = {
                Correlativo: rows[0].Correlativo || null,
                CodigoFactura: rows[0].CodigoRecibo || null,
                Fecha: rows[0].Fecha || null,
                Hora: rows[0].Hora || null,
                Estado: rows[0].Estado || null,
                Anticipo: rows[0].Anticipo || null,
                Saldo: rows[0].Saldo || 0,
                FechaPago: rows[0].FechaPago || null,
            };
            // Mapear los detalles de los recibos en un array separado
            const detalleRecibos = rows.map(row => ({
                Cantidad: row.Cantidad,
                NombreProducto: row.Detalles_Servicios,
                PrecioUnitario: row.PrecioUnitario,
                PrecioTotal: row.PrecioTotal,
                FacturaId: row.ComprobanteId,
            }));
            // Crear un objeto que contenga tanto los datos del cliente como los detalles de los recibos
            const facturaInfo = {
                Cliente: clienteInfo,
                DetalleRecibos: detalleRecibos,
                InfoFactura: FacturaDetalle
            };
            resolve(facturaInfo)
        } catch (error) {
            console.error('Error al obtener datos:', error);
            reject(error);
        }
    });
}

/******************************************************************************************************
                 FUNCION PARA BTENER DETALLES DE UN RECIBO EN PARA GENERAR EL PDF DESDE LA VISTA PUBLICA
 *****************************************************************************************************/
async function getReciboPDFbyCodigo(codigo) {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT 
                                            cc.NombreCliente,
                                            cc.Direccion, cc.Telefono,
                                            rc.Correlativo,
                                            rc.CodigoRecibo,
                                            rc.Fecha, rc.Hora,
                                            rc.Estado,
                                            rc.Anticipo,
                                            rc.Saldo,
                                            ds.Detalles_Servicios,
                                            ds.Cantidad,
                                            ds.PrecioUnitario,
                                            ds.PrecioTotal,
                                            ds.ComprobanteId
                                        FROM clientes cc 
                                        INNER JOIN recibos rc ON cc.Id = rc.IdCliente 
                                        INNER JOIN detalles_recibos ds ON rc.Id = ds.ComprobanteId 
                                        WHERE rc.CodigoRecibo = ?;`;
        try {
            const rows = await mysqlConnection.query(query, [codigo]);
            if (rows.length === 0) {
                return null;
            }
            // Extraer datos del cliente
            const clienteInfo = {
                NombreCliente: rows[0].NombreCliente || null,
                DireccionCliente: rows[0].Direccion || null,
                TelefonoCliente: rows[0].Telefono || null,
            };
            // Extraer datos del recibo
            const FacturaDetalle = {
                Correlativo: rows[0].Correlativo || null,
                CodigoFactura: rows[0].CodigoRecibo || null,
                Fecha: rows[0].Fecha || null,
                Hora: rows[0].Hora || null,
                Estado: rows[0].Estado || null,
                Anticipo: rows[0].Anticipo || null,
                Saldo: rows[0].Saldo || 0,
                FechaPago: rows[0].FechaPago || null,
            };
            // Mapear los detalles de los recibos en un array separado
            const detalleRecibos = rows.map(row => ({
                Cantidad: row.Cantidad,
                NombreProducto: row.Detalles_Servicios,
                PrecioUnitario: row.PrecioUnitario,
                PrecioTotal: row.PrecioTotal,
                FacturaId: row.ComprobanteId,
            }));
            // Crear un objeto que contenga tanto los datos del cliente como los detalles de los recibos
            const facturaInfo = {
                Cliente: clienteInfo,
                DetalleRecibos: detalleRecibos,
                InfoFactura: FacturaDetalle
            };
            resolve(facturaInfo)
        } catch (error) {
            console.error('Error al obtener datos:', error);
            reject(error);
        }
    });
}
/******************************************************************************************************
                 FUNCION PARA CONSULTAR UN RECIBO POR SU ID
 *****************************************************************************************************/
async function getRecibobyId(Id) {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT
        cc.NombreCliente,
        rc.Correlativo,
        rc.Id AS ComprobanteId,
        ds.Id AS DetalleId,
        ds.Detalles_Servicios,
        ds.Cantidad,
        ds.PrecioUnitario
    FROM
        clientes cc
    INNER JOIN
        recibos rc ON cc.Id = rc.IdCliente
    LEFT JOIN
        detalles_recibos ds ON rc.Id = ds.ComprobanteId
    WHERE
        rc.Correlativo = ?`;
        try {
            // Ejecutar la consulta SQL
            const rows = await mysqlConnection.query(query, [Id]);
            if (rows.length === 0) {
                return null;
            }
            // Extraer datos del cliente de la primera fila (suponiendo que los datos del cliente son los mismos para todas las filas)
            const clienteInfo = {
                Nombre: rows[0].NombreCliente || null,
                Correlativo: rows[0].Correlativo || null,
            };

            // Mapear los detalles de los recibos en un array separado
            const detalleComprobante = rows.map(row => ({
                Cantidad: row.Cantidad,
                NombreServicio: row.Detalles_Servicios,
                PrecioUnitario: row.PrecioUnitario,
                ComprobanteId: row.ComprobanteId,
                ServicioId: row.DetalleId
            }));
            // Crear un objeto que contenga tanto los datos del cliente como los detalles de los recibos
            const ReciboInfo = {
                Cliente: clienteInfo,
                DetallesComprobante: detalleComprobante,
            };
            resolve(ReciboInfo)
        } catch (error) {
            console.error('Error al obtener datos:', error);
            reject(error);
        }
    });
}

/******************************************************************************************************
                 FUNCION PARA CONSULTAR UN RECIBO POR EL CODIGO
 *****************************************************************************************************/
async function validateReciboByCodigo(codigo) {
    return new Promise(async (resolve, reject) => {
        try {
            const consultacodigo = 'SELECT * FROM recibos WHERE CodigoRecibo = ?;';
            const resultCodigo = await mysqlConnection.query(consultacodigo, [codigo]);

            if (resultCodigo.length > 0) {
                const query = `SELECT
                                    cc.NombreCliente,
                                    rc.Estado,
                                    rc.Correlativo,
                                    rc.CodigoRecibo,
                                    rc.Anticipo,
                                    rc.Saldo,
                                    SUM(ds.PrecioTotal) AS Total
                                FROM
                                    clientes cc
                                INNER JOIN
                                    recibos rc ON cc.Id = rc.IdCliente
                                LEFT JOIN
                                    detalles_recibos ds ON rc.Id = ds.ComprobanteId
                                WHERE
                                    rc.CodigoRecibo = ?`;

                const rows = await mysqlConnection.query(query, [codigo]);

                if (rows.length === 0) {
                    // Si no se encuentra ningún registro, rechazar con el código 404
                    reject({ status: 404, message: 'No se encontraron registros.' });
                } else {
                    // Si se encuentra algún registro, resolver con los datos
                    resolve(rows);
                }
            } else {
                // Si no hay resultados para el código de recibo, rechazar con el código 404
                reject({ status: 404, message: 'No se encontraron registros.' });
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
            reject(error);
        }
    });
}

/******************************************************************************************************
                 FUNCION PARA CREAR UN CLIENTE CON SERVICIOS PENDIENTES DE CANCELAR
 *****************************************************************************************************/

async function createRecibo(clienteData, servicioData) {

    return new Promise(async (resolve, reject) => {
        const { nombre, direccion, telefono, email, fechaActual, horaActual, cantidadAnticipada, saldoPendiente } = clienteData;
        const estadorecibo = 'Pendiente'
        const codigoR = codigoRecibo(50);
        try {
            const max_id = await maxid();
            const corr = max_id + 1;

            const clienteQuery = "INSERT INTO clientes (NombreCliente, Telefono, Direccion, Email) VALUES (?, ?, ?, ?)";
            const clienteResult = await mysqlConnection.query(clienteQuery, [nombre, telefono, direccion, email]);

            const facturaquery = "INSERT INTO recibos (IdCliente, Correlativo, CodigoRecibo, Fecha, Hora, Estado, Anticipo, Saldo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const facturaResult = await mysqlConnection.query(facturaquery, [clienteResult.insertId, corr, codigoR, fechaActual, horaActual, estadorecibo, cantidadAnticipada, saldoPendiente]);

            const recibodetallequery = "INSERT INTO detalles_recibos (ComprobanteId, Detalles_Servicios, Cantidad, PrecioUnitario, PrecioTotal) VALUES (?, ?, ?, ?, ?)";

            // Utilizar Promise.all directamente
            if (Array.isArray(servicioData)) {
                await Promise.all(servicioData.map(async (servicio) => {
                    const { descripcion, cantidad, precio } = servicio;
                    try {
                        await mysqlConnection.query(recibodetallequery, [facturaResult.insertId, descripcion, cantidad, precio, cantidad * precio]);

                    } catch (error) {
                        console.error(`Error al insertar detalle para ${descripcion}:`, error);
                        // Puedes acumular los errores en un array aquí
                    }
                }));
            } else {
                reject("Error: servicioData no es un array o es undefined");
            }

            // Realizar la consulta SQL correcta para obtener el correlativo
            const queryCorrelativo = "SELECT Correlativo FROM recibos WHERE Id = ?";
            const correlativoResult = await mysqlConnection.query(queryCorrelativo, [facturaResult.insertId]);
            const correlativo = correlativoResult[0].Correlativo;

          
            if(saldoPendiente == 0){
                const queryUpdate = "UPDATE recibos SET Estado = 'Cancelado', Anticipo = 0 WHERE Correlativo = ?";
                        mysqlConnection.query(queryUpdate, [correlativo], (updateError, updateResults) => {
                            if (updateError) {
                                console.error('Error al actualizar los datos:', updateError);
                            } else {
                                console.log('Datos actualizados correctamente.');
                            }
                        });
            }

            resolve(correlativo);

        } catch (error) {
            console.error('Error al insertar factura:', error);
            reject(error);
        }
    });
}

/******************************************************************************************************
                 FUNCION ACTUALIZAR SALDO DEL RECIBO
 *****************************************************************************************************/

async function payment(data) {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, cantidad } = data;

            // Consulta para obtener el saldo actual y el anticipo
            const saldoQuery = `
                SELECT
                    ComprobanteId,
                    SUM(PrecioTotal) AS SumaPrecioTotal,
                    cc.Anticipo,
                    Saldo AS SaldoRes
                FROM
                    detalles_recibos dc
                JOIN
                    recibos cc ON dc.ComprobanteId = cc.Id
                WHERE
                    cc.Correlativo = ${id}
                GROUP BY
                    cc.Correlativo, cc.Anticipo
            `;

            // Ejecutar la consulta SQL para obtener el saldo, anticipo y estado
            const [saldoResult] = await mysqlConnection.query(saldoQuery);
            const saldoPendiente = saldoResult.SaldoRes;

            // Verificar si se obtuvieron resultados
            if (!saldoResult || saldoResult.length === 0) {
                reject("No se encontraron registros para el correlativo proporcionado.");
                return;
            }

            // Obtener el saldo, anticipo y estado desde los resultados
            const saldoActual = saldoResult.SumaPrecioTotal;
            const anticipoActual = saldoResult.Anticipo;



            // Verificar si las propiedades necesarias están definidas
            if (saldoActual === undefined || anticipoActual === undefined) {
                reject("Los resultados de la consulta no contienen las propiedades necesarias.");
                return;
            }


            //conbertir a numeo las cantidades antes de realizar alidaciones
            const saldoPendienteNumber = Number(saldoPendiente);
            const cantNumber = Number(cantidad)
            // Verificar si la cantidad a pagar es mayor al saldo
            if (cantNumber > saldoPendienteNumber) {
                reject("La cantidad a pagar es mayor al saldo actual.");
                return;
            }

            // Consulta para realizar la actualización del saldo y el anticipo
            const updateSaldoQuery = `
                UPDATE recibos cc
                JOIN (
                    SELECT
                        ComprobanteId,
                        SUM(PrecioTotal) AS SumaPrecioTotal,
                        cc.Anticipo
                    FROM
                        detalles_recibos dc
                    JOIN
                        recibos cc ON dc.ComprobanteId = cc.Id
                    WHERE
                        cc.Correlativo = ${id}
                    GROUP BY
                        cc.Correlativo, cc.Anticipo
                ) AS t1 ON cc.Id = t1.ComprobanteId
                SET 
                    cc.Saldo = CASE
                        WHEN t1.SumaPrecioTotal - t1.Anticipo >= ${cantidad} THEN t1.SumaPrecioTotal - t1.Anticipo - ${cantidad}
                        ELSE t1.SumaPrecioTotal - t1.Anticipo
                    END,
                    cc.Anticipo = CASE
                        WHEN t1.SumaPrecioTotal - t1.Anticipo >= ${cantidad} THEN t1.Anticipo + ${cantidad}
                        ELSE t1.Anticipo
                    END;
            `;

            // Ejecutar la consulta SQL para actualizar el Saldo y Anticipo
            const updateResult = await mysqlConnection.query(updateSaldoQuery);

            const Saldovalidar = "SELECT Saldo FROM recibos WHERE Correlativo = ?";

            const resultsaldo = await mysqlConnection.query(Saldovalidar, [id]);

            if (resultsaldo && resultsaldo.length > 0) {
                const saldo = resultsaldo[0].Saldo;

                // Verificar si el saldo es igual a 0
                if (saldo == 0) {
                    // Actualizar el estado del comprobante
                    const updateEstado = "UPDATE recibos SET Estado = 'Cancelado', Anticipo = 0 WHERE Correlativo = ?";
                    const resultEstado = await mysqlConnection.query(updateEstado, [id]);
                    console.log("Estado actualizado a 'Cancelado'");
                } else {
                    console.log("El saldo no es igual a 0, no se actualizó el estado.");
                }
            } else {
                console.log("No se encontró el comprobante con el correlativo proporcionado.");
            }
            // Verificar si se realizó la actualización correctamente
            if (updateResult.affectedRows > 0) {
                resolve("Transacción exitosa");
            } else {
                // No se encontró ningún registro para el correlativo proporcionado
                reject("No se encontró ningún registro para el correlativo proporcionado.");
            }

        } catch (error) {
            console.error('Error al realizar la operación:', error);
            reject(error);
        }
    });
}





/******************************************************************************************************
                 funcion para seleccionar el maximo id
 *****************************************************************************************************/
async function maxid() {
    return new Promise(async (resolve, reject) => {
        const query = "SELECT MAX(Correlativo) AS max_id FROM recibos";
        try {
            const result = await mysqlConnection.query(query);
            const max_id = result[0].max_id;
            resolve(max_id);
        } catch (error) {
            reject(error);
        }
    });
}
/******************************************************************************************************
                 FUNCION PARA ELIMINAR UN RECIBO POR SU ID
 *****************************************************************************************************/
async function deleteReciboById(Correlativo) {
    return new Promise(async (resolve, reject) => {
        const deleteQuery = `
                            DELETE FROM clientes
                            WHERE Id = (
                                SELECT IdCliente
                                FROM recibos
                                WHERE Correlativo = ?
                            );
                        `;

        try {
            const result = await mysqlConnection.query(deleteQuery, [Correlativo]);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
}



/******************************************************************************************************
                 FUNCION PARA ELIMINAR UN ITEM POR SERVICIO ID
 *****************************************************************************************************/
async function deleteItemReciboById(Id) {
    return new Promise(async (resolve, reject) => {
        try {
            const queryServicioId = "DELETE FROM detalles_recibos WHERE Id=?"
            const resultServicioId = await mysqlConnection.query(queryServicioId, [Id])
            resolve(resultServicioId);
        } catch (error) {
            reject(error);
        }
    });
}



/******************************************************************************************************
                 FUNCION PARA ACTUALIZAR DATOS DE LOS RECIBOS O INSERTAR U NUEVO REGISTRO SI NO EXISTE
 *****************************************************************************************************/

async function updateReciboById(correlativo, updatedServicioData) {
    return new Promise(async (resolve, reject) => {
        try {
            const queryCorrelativo = "SELECT Id FROM recibos WHERE Correlativo = ?";
            const correlativoResult = await mysqlConnection.query(queryCorrelativo, [correlativo]);

            if (correlativoResult.length === 0) {
                reject("Correlativo no encontrado");
                return;
            }

            const idComprobante = correlativoResult[0].Id;

            const promesasConsultas = updatedServicioData.map(async (updatedServicioData) => {
                const { IdServicio, Cantidad, NombreServicio, PrecioUnitario } = updatedServicioData;
                const queryDetallesServicios = "SELECT * FROM detalles_recibos WHERE Id = ? AND ComprobanteId = ?";
                const detallesServiciosResults = await mysqlConnection.query(queryDetallesServicios, [IdServicio, idComprobante]);

                if (detallesServiciosResults.length > 0) {
                    const updatequery =
                        "UPDATE detalles_recibos SET Detalles_Servicios = ?, Cantidad = ?, PrecioUnitario = ?, PrecioTotal = ? WHERE Id = ? AND ComprobanteId = ?";
                    await mysqlConnection.query(updatequery, [
                        NombreServicio,
                        Cantidad,
                        PrecioUnitario,
                        Cantidad * PrecioUnitario,
                        IdServicio,
                        idComprobante,
                    ]);

                    actualizarSaldoDesdeSumaYAnticipo(idComprobante);
                } else {
                    const Newquery =
                        "INSERT INTO detalles_recibos (ComprobanteId, Detalles_Servicios, Cantidad, PrecioUnitario, PrecioTotal) VALUES (?, ?, ?, ?, ?)";
                    await mysqlConnection.query(Newquery, [
                        idComprobante,
                        NombreServicio,
                        Cantidad,
                        PrecioUnitario,
                        Cantidad * PrecioUnitario,
                    ]);

                    actualizarSaldoDesdeSumaYAnticipo(idComprobante);


                }
            });

            await Promise.all(promesasConsultas);

            resolve(correlativo);
        } catch (error) {
            // console.error("Error al actualizar el Recibo:", error);
            reject(error);
        }
    });
}


/******************************************************************************************************
                 FUNCION PARA CONSULTAR NOMBRES EN TIEMPO REAL
 *****************************************************************************************************/
async function getAllRecibosByName(name) {
    //const queryRecibos = "SELECT c.NombreCliente, c.Direccion, f.Correlativo, f.Fecha, f.Estado, f.Saldo FROM clientes c INNER JOIN factura f ON c.Id = f.IdCliente WHERE c.NombreCliente LIKE ?";
    const queryRecibos = `SELECT cc.NombreCliente,
    cc.Direccion,
    cc.Telefono, 
    rc.Correlativo, 
    rc.Fecha, 
    rc.Estado, 
    rc.Anticipo, 
    rc.Saldo, 
SUM(ds.PrecioTotal) AS Total 
FROM 
clientes cc 
INNER JOIN recibos rc ON cc.Id = rc.IdCliente 
LEFT JOIN detalles_recibos ds ON rc.Id = ds.ComprobanteId WHERE cc.NombreCliente LIKE ?
GROUP BY cc.NombreCliente, cc.Direccion, rc.Correlativo, rc.Fecha, rc.Estado, rc.Anticipo, rc.Saldo`;
    try {
        const rows = await mysqlConnection.query(queryRecibos, [`%${name}%`]);
        return rows;
    } catch (error) {
        console.error("Error al obtener los recibos por nombre:", error);
        throw error;
    }
}



/******************************************************************************************************
                 FUNCION PARA ACTUALIZAR LOS SALDOS
 *****************************************************************************************************/
async function actualizarSaldoDesdeSumaYAnticipo(idComprobante) {
    const updateSaldo = `
        UPDATE recibos cc
        JOIN (
            SELECT
                dc.ComprobanteId,
                SUM(dc.PrecioTotal) AS SumaPrecioTotal,
                cc.Anticipo,
                (SUM(dc.PrecioTotal) - cc.Anticipo) AS ResultadoFinal
            FROM
                detalles_recibos dc
            JOIN
                recibos cc ON dc.ComprobanteId = cc.Id
            WHERE
                cc.Id = ?
            GROUP BY
                dc.ComprobanteId, cc.Anticipo
        ) t1 ON cc.Id = t1.ComprobanteId
        SET cc.Saldo = t1.ResultadoFinal;
    `;

    try {
        await mysqlConnection.query(updateSaldo, [idComprobante])

    } catch (error) {
        reject(error)
        throw error;
    }
}

// Exporta las funciones del modelo para que puedan ser utilizadas en otros módulos
module.exports = {
    getAllRecibos,
    getRecibobyId,
    createRecibo,
    deleteReciboById,
    updateReciboById,
    getReciboPDF,
    deleteItemReciboById,
    getAllRecibosByName,
    payment,
    validateReciboByCodigo,
    getReciboPDFbyCodigo
};
