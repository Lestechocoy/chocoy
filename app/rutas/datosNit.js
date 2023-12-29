const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador
const datosNitController = require('../controladores/datosNit');
const checkOrigin = require('../middleware/cors');
const { NewToken, VerifyToken } = require('../middleware/auth');

router.get('/', VerifyToken, datosNitController.getAllDatos);
router.get('/:id', VerifyToken, datosNitController.getUserById);
router.get('/filterByName/:name', VerifyToken, datosNitController.filterClientByName);
router.post('/', VerifyToken, datosNitController.createClient);
router.patch('/:id', VerifyToken, datosNitController.updateClienteById);
router.delete('/:id',VerifyToken,datosNitController.deleteClienteById)


module.exports = router;