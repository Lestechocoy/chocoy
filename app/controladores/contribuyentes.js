// datosNit Controller.js

const ContribuyentesModel = require('../modelos/contribuyentes');
const respuesta = require('../Helpers/respuestas');


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS CONTRIBUYENTES
//  *****************************************************************************************************/
async function getAllContribuyentes(req, res) {
    try {

        const datos = await ContribuyentesModel.getAllContribuyentes();
        respuesta.success(req, res, datos, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500)
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN CONTRIBUYENTE POR SU NOMBRE
 *****************************************************************************************************/
async function filterContribuyenteByName(req, res) {
    try {
        const name = req.params.name;
        const nombres = await ContribuyentesModel.filterContribuyenteByName(name);
        if (!nombres) {
            return respuesta.NotFound(res, req, 'Usuario no encontrado', 400)
        }
        respuesta.success(req, res, nombres, 200);
    } catch (error) {
        respuesta.error(req, res, error, 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN CONTRIBUYENTE POR SU NOMBRE
 *****************************************************************************************************/
                 async function filterContabilidadByName(req, res) {
                    try {
                        const name = req.params.name;
                        const nombres = await ContribuyentesModel.filterContabilidadByName(name);
                        if (!nombres) {
                            return respuesta.NotFound(res, req, 'Usuario no encontrado', 400)
                        }
                        respuesta.success(req, res, nombres, 200);
                    } catch (error) {
                        respuesta.error(req, res, error, 500);
                    }
                }


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER TODOS LOS CONTRIBUYENTES Y SU CONTABILIDAD
//  *****************************************************************************************************/
async function getContabilidadContribuyentes(req, res) {
    try {

        const datos = await ContribuyentesModel.getContabilidadContribuyentes();
        respuesta.success(req, res, datos, 200)
    } catch (error) {
        respuesta.error(req, res, error, 500)
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN CONTRIBUYENTE POR SU ID Y SU CONTABILIDAD
 *****************************************************************************************************/
async function getContabilidadContribuyenteById(req, res) {

    try {
        const contrId = req.params.id;
        const contribuyente = await ContribuyentesModel.getContabilidadContribuyenteById(contrId);

        if (!contribuyente) {
            return respuesta.NotFound(res, req, 'Contribuyente no encontrado', 400)

        }
        respuesta.success(req, res, contribuyente, 200);

    } catch (error) {

        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA OBTENER UN CONTRIBUYENTE POR SU ID
 *****************************************************************************************************/
async function getContribuyenteById(req, res) {

    try {
        const contrId = req.params.id;
        const contribuyente = await ContribuyentesModel.getContribuyenteById(contrId);

        if (!contribuyente) {
            return respuesta.NotFound(res, req, 'Contribuyente no encontrado', 400)

        }
        respuesta.success(req, res, contribuyente, 200);

    } catch (error) {

        respuesta.error(req, res, error, 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA CREAR UN CONTRIBUYENTE NUEVO
 ******************************************************************************************************/
async function createContribuyente(req, res) {
    const newContribuyente = req.body;
    try {
        // Intenta crear el usuario
        const ContribuyenteId = await ContribuyentesModel.createContribuyente(newContribuyente)
        respuesta.success(req, res, { message: 'Contribuyene creado con éxito', ContribuyenteId }, 200);
    } catch (error) {
        // Otro error, devuelve un mensaje genérico de error
        respuesta.error(req, res, 'Error al crear el contribuyente', 500); // Código de estado 500 para errores del servidor

    }
}




/******************************************************************************************************
                 CONTROLADOR PARA ELIMINAR UN CLIENTE POR SU ID
 *****************************************************************************************************/
async function deleteContribuyenteById(req, res) {
    try {
        const contrId = req.params.id; // Se espera que el ID del usuario esté en los parámetros de la URL

        const affectedRows = await ContribuyentesModel.deleteContribuyenteById(contrId);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'contribuyente no encontrado', 404);
        } else {
            respuesta.success(req, res, 'contribuyente eliminado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al eliminar el contribuyente', 500);
    }
}



/******************************************************************************************************
                 CONTROLADOR PARA EDITAR DATOS DE UN CONTRIBUYENTE POR SU ID
 *****************************************************************************************************/
async function updateContribuyenteById(req, res) {
    console.log(req.body)
    try {
        const contrId = req.params.id;
        const updateContribuyenteData = req.body;


        const affectedRows = await ContribuyentesModel.updateContribuyenteById(contrId, updateContribuyenteData);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Contribuyente no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Contribuyente actualizado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al actualizar el Contribuyente', 500);
    }
}


/******************************************************************************************************
                 CONTROLADOR PARA EDITAR CONTABILIDAD DE UN CONTRIBUYENTE POR SU ID
 *****************************************************************************************************/
async function updateContabilidadContribuyenteById(req, res) {

    try {
        const contrId = req.params.id;
        const updateContabilidadData = req.body;
        const affectedRows = await ContribuyentesModel.updateContabilidadContribuyenteById(contrId, updateContabilidadData);

        if (affectedRows === 0) {
            respuesta.error(req, res, 'Contribuyente no encontrado', 404);
        } else {
            respuesta.success(req, res, 'Contribuyente actualizado con éxito', 200);
        }
    } catch (error) {
        respuesta.error(req, res, 'Error al actualizar el Contribuyente' + error, 500);
    }
}







// Exporta los controladores para que puedan ser utilizados en las rutas de Express
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
