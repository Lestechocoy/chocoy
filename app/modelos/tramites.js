const mysqlConnection = require("../../config/mysql");
const { encrypt, compare } = require("../Helpers/HandleBcrypt");
const { codigoTramite } = require("../Helpers/RandomText");

/******************************************************************************************************
                 FUNCION PARA OBTENER TODAS LAS NOTAS DE LA BASE DE DATOS
 *****************************************************************************************************/
async function getAllTramites() {
  try {
    const rows = await mysqlConnection.query(`SELECT 
        ct.Id,
        ct.Nombre,
        ct.Direccion,
        ct.Telefono,
        CASE
          WHEN COUNT(*) = SUM(CASE WHEN dt.Estado = 'Finalizado' THEN 1 ELSE 0 END) THEN 'Finalizado'
          ELSE 'Pendiente'
        END AS Estado
      FROM clientes_tramites AS ct
      LEFT JOIN detalles_tramites AS dt ON ct.Id = dt.IdClientesTramites
      GROUP BY ct.Id, ct.Nombre, ct.Telefono;`);
    return rows;
  } catch (error) {
    throw error;
  }
}

/******************************************************************************************************
                 FUNCION PARA CONSULTAR UN TRAMITE POR ID
 *****************************************************************************************************/
async function getTramitebyId(Id) {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT ct.Id AS IdCliente, ct.Nombre, ct.Direccion, ct.Telefono, dt.Id AS IdTramite, dt.Estado, dt.Descripcion 
                        FROM clientes_tramites AS ct 
                        INNER JOIN detalles_tramites AS dt ON ct.Id = dt.IdClientesTramites 
                        WHERE ct.Id = ?`;
    try {
      // Ejecutar la consulta SQL
      const rows = await mysqlConnection.query(query, [Id]);
      if (rows.length === 0) {
        return null;
      }
      // Extraer datos del cliente de la primera fila (suponiendo que los datos del cliente son los mismos para todas las filas)
      const clienteInfo = {
        Nombre: rows[0].Nombre || null,
        Direccion: rows[0].Direccion || null,
        Telefono: rows[0].Telefono || null,
        ClienteId: rows[0].IdCliente,
      };

      // Mapear los detalles de los recibos en un array separado
      const detalleTramites = rows.map((row) => ({
        Descripcion: row.Descripcion,
        Estado: row.Estado,
        TramiteId: row.IdTramite,
      }));
      // Crear un objeto que contenga tanto los datos del cliente como los detalles de los recibos
      const datos = {
        Cliente: clienteInfo,
        Detalles: detalleTramites,
      };
      resolve(datos);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      reject(error);
    }
  });
}

/******************************************************************************************************
                 FUNCION PARA CREARUN TTRAMITE
 *****************************************************************************************************/

async function createTramite(clienteData, servicioData) {
  return new Promise(async (resolve, reject) => {
    const codigoT = codigoTramite(11);
    const { nombre, direccion, telefono, cui, fechaActual, horaActual } =
      clienteData;
    try {
      const clienteQuery =
        "INSERT INTO clientes_tramites (Nombre, Direccion, Telefono, Cui, Codigo, Fecha, Hora) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const clienteResult = await mysqlConnection.query(clienteQuery, [
        nombre,
        direccion,
        telefono,
        cui,
        codigoT,
        fechaActual,
        horaActual,
      ]);

      const Tramitesquery =
        "INSERT INTO detalles_tramites (IdClientesTramites, Descripcion, Estado) VALUES (?, ?, ?)";
      // Utilizar Promise.all directamente
      if (Array.isArray(servicioData)) {
        await Promise.all(
          servicioData.map(async (servicio) => {
            const { descripcion, estado } = servicio;
            try {
              await mysqlConnection.query(Tramitesquery, [
                clienteResult.insertId,
                descripcion,
                estado,
              ]);
            } catch (error) {
              console.error(
                `Error al insertar detalle para ${descripcion}:`,
                error
              );
              // Puedes acumular los errores en un array aquí
            }
          })
        );
      } else {
        reject("Error: servicioData no es un array o es undefined");
      }
      await postDataToAPI(telefono, codigoT);
      resolve(clienteResult.insertId);
    } catch (error) {
      console.error("Error al insertar los detalles:", error);
      reject(error);
    }
  });
}

/******************************************************************************************************
                 FUNCION PARA EDITAR UN TRAMITE POR SU ID
 *****************************************************************************************************/
async function updateTramiteById(IdCliente, updatedTramiteData) {
  return new Promise(async (resolve, reject) => {
    try {
      const promesasConsultas = updatedTramiteData.map(
        async (updatedTramiteData) => {
          const { IdTramite, Descripcion, Estado } = updatedTramiteData;
          const queryDetallesTramites =
            "SELECT * FROM detalles_tramites WHERE Id = ? AND IdClientesTramites = ?";

          const detallesTramitesResults = await mysqlConnection.query(
            queryDetallesTramites,
            [IdTramite, IdCliente]
          );

          if (detallesTramitesResults.length > 0) {
            const updatequery =
              "UPDATE detalles_tramites SET Descripcion = ?, Estado = ? WHERE Id = ? AND IdClientesTramites = ?";
            await mysqlConnection.query(updatequery, [
              Descripcion,
              Estado,
              IdTramite,
              IdCliente,
            ]);
          } else {
            const Newquery =
              "INSERT INTO detalles_tramites (IdClientesTramites, Descripcion, Estado) VALUES (?, ?, ?)";
            await mysqlConnection.query(Newquery, [
              IdCliente,
              Descripcion,
              Estado,
            ]);
          }
        }
      );

      await Promise.all(promesasConsultas);

      resolve(200);
    } catch (error) {
      // console.error("Error al actualizar el Recibo:", error);
      reject(error);
    }
  });
}

/******************************************************************************************************
                 FUNCION PARA ELIMINAR UN ITEM POR TRAMITE ID
 *****************************************************************************************************/
async function deleteItemTramiteById(Id) {
  return new Promise(async (resolve, reject) => {
    try {
      const queryTramiteId = "DELETE FROM  detalles_tramites WHERE Id=?";
      const resultTramiteId = await mysqlConnection.query(queryTramiteId, [Id]);
      resolve(resultTramiteId);
    } catch (error) {
      reject(error);
    }
  });
}

/******************************************************************************************************
                 FUNCION PARA ELIMINAR UN TRAMITE POR SU ID
 *****************************************************************************************************/
async function deleteTramiteById(Id) {
  return new Promise(async (resolve, reject) => {
    const query = "DELETE FROM clientes_tramites WHERE id = ?";

    try {
      const results = await mysqlConnection.query(query, [Id]);
      // Devuelve el número de filas eliminadas (debería ser 1 si se eliminó correctamente)
      resolve(results.affectedRows);
    } catch (error) {
      reject(error);
    }
  });
}

/******************************************************************************************************
 FUNCION PARA CONSULTAR NOMBRES EN TIEMPO REAL
*****************************************************************************************************/
async function getAllTramitesByName(name) {
  //const queryRecibos = "SELECT c.NombreCliente, c.Direccion, f.Correlativo, f.Fecha, f.Estado, f.Saldo FROM clientes c INNER JOIN factura f ON c.Id = f.IdCliente WHERE c.NombreCliente LIKE ?";
  const queryNotas = `SELECT 
    ct.Id,
    ct.Nombre,
    ct.Direccion,
    ct.Telefono,
    CASE
      WHEN COUNT(*) = SUM(CASE WHEN dt.Estado = 'Finalizado' THEN 1 ELSE 0 END) THEN 'Finalizado'
      ELSE 'Pendiente'
    END AS Estado
  FROM clientes_tramites AS ct
  LEFT JOIN detalles_tramites AS dt ON ct.Id = dt.IdClientesTramites
  WHERE ct.Nombre LIKE ?
  GROUP BY ct.Id, ct.Nombre, ct.Telefono;`;
  try {
    const rows = await mysqlConnection.query(queryNotas, [`%${name}%`]);
    return rows;
  } catch (error) {
    console.error("Error al obtener los recibos por nombre:", error);
    throw error;
  }
}

/******************************************************************************************************
                 FUNCION PARA CONSULTAR EL ESTADO DEL TRÁMITE DESDE EL PUBLICO POR EL CUI
 *****************************************************************************************************/
async function getEstadoTramitebyCodigo(codigo) {
  // Llamada a la función para obtener el código de 11 caracteres + año actual

  return new Promise(async (resolve, reject) => {
    const query = `SELECT ct.Nombre, dt.Estado, dt.Descripcion 
                        FROM clientes_tramites AS ct 
                        INNER JOIN detalles_tramites AS dt ON ct.Id = dt.IdClientesTramites 
                        WHERE ct.Codigo = ?`;
    try {
      // Ejecutar la consulta SQL
      const rows = await mysqlConnection.query(query, [codigo]);
      if (rows.length === 0) {
        reject(500);
        return;
      }
      // Extraer datos del cliente de la primera fila (suponiendo que los datos del cliente son los mismos para todas las filas)
      const clienteInfo = {
        Nombre: rows[0].Nombre || null,
      };

      // Mapear los detalles de los recibos en un array separado
      const detalleTramites = rows.map((row) => ({
        Descripcion: row.Descripcion,
        Estado: row.Estado,
      }));
      // Crear un objeto que contenga tanto los datos del cliente como los detalles de los recibos
      const datos = {
        Cliente: clienteInfo,
        Detalles: detalleTramites,
      };
      resolve(datos);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      reject(error);
    }
  });
}

async function postDataToAPI(telefono, codigoT) {
  const url = "http://localhost:3005/lead";
  const data = {
    "message":"Se registró su trámite correctamente. Puede verficar el estado en el siguiente link http://localhost:3001/tramites/"+ codigoT,
    "phone": "502"+telefono
  }; // Cambia esta estructura de datos según lo que necesites enviar
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Agrega cualquier encabezado necesario aquí
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      console.log("¡Datos enviados correctamente a la API!");

    } else {
      console.error("Error al enviar datos a la API:", response.status);
    }
  } catch (error) {
    console.error("Error de red al enviar datos a la API:", error);
  }
}

module.exports = {
  getAllTramites,
  getTramitebyId,
  createTramite,
  deleteTramiteById,
  updateTramiteById,
  getAllTramitesByName,
  deleteItemTramiteById,
  getEstadoTramitebyCodigo,
};
