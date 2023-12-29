const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador
const satController = require('../controladores/sat');
const checkOrigin = require('../middleware/cors');
const { NewToken, VerifyToken } = require('../middleware/auth');



router.post('/', VerifyToken, satController.getNit);


module.exports = router;
