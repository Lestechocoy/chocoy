const express = require('express');
const router = express.Router(); // Invoca express.Router() para crear un objeto enrutador
const userController = require('../controladores/usuarios');
const checkOrigin = require('../middleware/cors');
const { NewToken, VerifyToken } = require('../middleware/auth');


router.get('/', VerifyToken,userController.getAllUsers);
router.get('/:id', VerifyToken, userController.getUserById);
router.post('/', VerifyToken, userController.createUser);
router.patch('/:id', VerifyToken, userController.updateUserById);
router.delete('/:id',VerifyToken, userController.deleteUserById);

module.exports = router;
