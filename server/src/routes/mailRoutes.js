const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');
const multer = require('multer');
const path = require('path');

// Configuration Multer pour l'upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Route pour récupérer les messages
router.get('/messages', mailController.recupererMessages);

// Route pour créer un message (texte, fichier ou vocal)
router.post('/', upload.single('fichier_joint'), mailController.createMail);

// Modifier un message
router.put('/:id', mailController.updateMail);

// Supprimer un message
router.delete('/:id', mailController.deleteMail);

module.exports = router;