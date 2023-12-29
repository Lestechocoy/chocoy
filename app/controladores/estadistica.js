// meses controller
const estadisticasModel = require('../modelos/estadistica');
const respuesta = require('../Helpers/respuestas');



/*======================================================================
obtener la sestadisticas
=======================================================================*/
async function getEstadisticas(req, res) {
    try {
        const resp = await estadisticasModel.getEstadisticas();
        respuesta.success(req, res, resp, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}

/*======================================================================
obtener el progreso de los tramites
=======================================================================*/
async function getProgresoTramites(req, res) {
    try {
        const resp = await estadisticasModel.getProgresoTramites();
        respuesta.success(req, res, resp, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}


module.exports = {
    getEstadisticas,
    getProgresoTramites
}