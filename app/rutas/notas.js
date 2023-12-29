// check token ruta
const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador

const checkOrigin = require('../middleware/cors');
const { NewToken, VerifyToken } = require('../middleware/auth');
const notasController = require ('../controladores/notas')

router.get('/', VerifyToken, notasController.getAllNotas); //obtener todas las notas
router.get('/:id', VerifyToken, notasController.getNotaById); //obtener una nota por su id
router.get('/filterByName/:name', VerifyToken, notasController.getAllNotasByName); //obtener una nota por el nombre
router.post('/', VerifyToken, notasController.createNota); //crear una nota
router.patch('/:id', VerifyToken, notasController.updateNotaById); //actualizar una nota por su id
router.delete('/:id', VerifyToken, notasController.deleteNotaById)

module.exports = router;