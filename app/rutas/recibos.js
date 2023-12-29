const express = require('express');
const router = express.Router(); 
const reciboController = require('../controladores/recibos');
const { NewToken, VerifyToken } = require('../middleware/auth');
const corsMiddleware = require('../middleware/cors');



router.get('/', VerifyToken, reciboController.getAllRecibos); //obtener todos los recibos
router.get('/:id', VerifyToken, reciboController.getRecibobyId); //obtner un recibo por su id
router.get('/print/:id', VerifyToken, reciboController.getReciboPDF); //obtener los datos de un recibo para genera el pdf
router.get('/publicPDf/:codigo', reciboController.getReciboPDFbyCodigo); //obtener los datos de un recibo para genera el pdf desde la vista publica
router.get('/validate/:codigo', reciboController.validateReciboByCodigo);//obtener datos del recibo por el codigo
router.get('/filterByName/:name', VerifyToken, reciboController.getAllRecibosByName); //filtrar los recibos por nombres
 router.post('/', VerifyToken, reciboController.createRecibo); //crear un nuevo recibo
router.post('/payment/:id', VerifyToken, reciboController.payment); // abonar saldo de un recibo
router.patch('/:id', VerifyToken, reciboController.updateReciboById); //actualizar datos de un recibo
router.delete('/:id', VerifyToken, reciboController.deleteReciboById); // eliminar un recibo completo
router.delete('/item/:id', VerifyToken, reciboController.deleteItemReciboById); //eliminar un item del recibo
// //router.post('/get/:id',)

module.exports = router;
