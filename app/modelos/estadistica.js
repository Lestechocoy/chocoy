//meses model
const mysqlConnection = require('../../config/mysql');
/******************************************************************************************************
            obtener la cantidad de registros dentr de la base de datos     
 *****************************************************************************************************/

async function getEstadisticas() {
    try {
        const totalClientes = (await mysqlConnection.query('SELECT COUNT(*) AS totalClientes FROM datosnit'))[0].totalClientes;
        const totalContribuyentes = (await mysqlConnection.query('SELECT COUNT(*) AS totalContribuyentes FROM contribuyentes'))[0].totalContribuyentes;
        const totalUsuarios = (await mysqlConnection.query('SELECT COUNT(*) AS totalUsuarios FROM usuario'))[0].totalUsuarios;
        const totalRecibos = (await mysqlConnection.query('SELECT COUNT(*) AS totalRecibos FROM recibos'))[0].totalRecibos;
        const totalNotas = (await mysqlConnection.query('SELECT COUNT(*) AS totalNotas FROM notas'))[0].totalNotas;
        const totalTramites = (await mysqlConnection.query('SELECT COUNT(*) AS totalTramites FROM clientes_tramites'))[0].totalTramites;


        const estadisticas = {
            totalClientes,
            totalContribuyentes,
            totalUsuarios,
            totalRecibos,
            totalNotas,
            totalTramites
        };

        return estadisticas;
    } catch (error) {
        throw error;
    }
}


/******************************************************************************************************
            obtener el progreso de los trámites     
 *****************************************************************************************************/
       
            async function getProgresoTramites() {
                try {

            
                const query = `SELECT 
                ct.Id,
                ct.Nombre,
                ct.Telefono,
                COUNT(*) AS TotalRegistros,
                SUM(CASE WHEN dt.Estado = 'Finalizado' THEN 1 ELSE 0 END) AS RegistrosFinalizados,
                CASE
                  WHEN SUM(CASE WHEN dt.Estado <> 'Finalizado' THEN 1 ELSE 0 END) > 0 THEN 'Pendiente'
                  ELSE 'Finalizado'
                END AS EstadoTramite
              FROM clientes_tramites AS ct
              LEFT JOIN detalles_tramites AS dt ON ct.Id = dt.IdClientesTramites
              GROUP BY ct.Id, ct.Nombre, ct.Telefono
              HAVING RegistrosFinalizados < TotalRegistros;`
                
                  const result = await mysqlConnection.query(query);
              
              
                  return result;
                } catch (error) {
                  throw error;
                }
              }
              


module.exports = {
    getEstadisticas,
    getProgresoTramites
}