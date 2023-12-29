// userController.js
const satModel= require('../modelos/sat');
const respuesta = require('../Helpers/respuestas');



/*======================================================================
obtener el nit
=======================================================================*/
async function getNit(req, res) {
    try {
        const valorInput = req.body.valorInput;
        const data = await satModel.fetchNitData(valorInput);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getNit
};