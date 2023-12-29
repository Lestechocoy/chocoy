const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador
const estadisticaController = require('../controladores/estadistica');
const { NewToken, VerifyToken } = require('../middleware/auth');



router.get('/', estadisticaController.getEstadisticas);
router.get('/tramites', estadisticaController.getProgresoTramites);


module.exports = router;
