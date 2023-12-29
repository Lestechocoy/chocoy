const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador
const { NewToken, VerifyToken } = require('../middleware/auth');
const {authUser, validarToken} = require('../controladores/auth')

router.post('/session', VerifyToken, validarToken);
router.post('/login',authUser );

module.exports = router;