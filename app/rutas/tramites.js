// check token ruta
const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador

const checkOrigin = require('../middleware/cors');
const { NewToken, VerifyToken } = require('../middleware/auth');
const tramitesController = require ('../controladores/tramites')

router.get('/', VerifyToken, tramitesController.getAllTramites); //obtener todas los tramites
router.get('/:id', VerifyToken, tramitesController.getTramiteById); //obtener un tramite por su id
router.get('/filterByName/:name', VerifyToken, tramitesController.getAllTramiteByName); //obtener una nota por el nombre
router.get('/estado/:cui', tramitesController.getEstadoTramiteByCodigo); //obtener una tramite por el cui
router.post('/', VerifyToken, tramitesController.createTramite); //crear un tramite
router.patch('/:id', VerifyToken, tramitesController.updateTramiteById); //actualizar un tramite por su id
router.delete('/item/:id', VerifyToken, tramitesController.deleteItemTramiteById); //eliminar un item del tramite
router.delete('/:id', VerifyToken, tramitesController.deleteTramiteById); //eliminar un tramite

module.exports = router;