const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador
const contribuyentesController = require('../controladores/contribuyentes');
const checkOrigin = require('../middleware/cors');
const { NewToken, VerifyToken } = require('../middleware/auth');

router.get('/', VerifyToken, contribuyentesController.getAllContribuyentes); //obtenre todos los contribuyentes
router.get('/filterContribuyenteByName/:name', VerifyToken, contribuyentesController.filterContribuyenteByName); //filtrar contribuyentes por nombres
router.get('/filterContabilidadByName/:name', VerifyToken, contribuyentesController.filterContabilidadByName); //filtrar contribuyentes por nombres
router.get('/contabilidad/', VerifyToken, contribuyentesController.getContabilidadContribuyentes); //obtener la lista de contabilidad de contribuyentes
router.get('/contabilidad/:id', VerifyToken, contribuyentesController.getContabilidadContribuyenteById); //obtener la contabilidad de contribuyente por su id
router.get('/:id', VerifyToken, contribuyentesController.getContribuyenteById); //obtener un contribuyente por su id
router.post('/', VerifyToken, contribuyentesController.createContribuyente); //crear un contribuyente
router.patch('/contabilidad/:id', VerifyToken, contribuyentesController.updateContabilidadContribuyenteById); //actualizar datos de contabilidad de contribuyentes
router.patch('/:id', VerifyToken, contribuyentesController.updateContribuyenteById); //actualizar datos de contribuyentes
router.delete('/:id',VerifyToken,contribuyentesController.deleteContribuyenteById); //eliminar contribuyente


module.exports = router;