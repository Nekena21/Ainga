const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

// Routes pour les utilisateurs
router.get('/', utilisateurController.getAllUsers);
router.post('/', utilisateurController.createUser);
router.post('/login', utilisateurController.loginUser);

module.exports = router;