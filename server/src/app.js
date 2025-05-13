const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./db');

const app = express();
const PORT = 5000;

// Autoriser toutes les origines (pour développement)
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/mails', require('./routes/mailRoutes'));
app.use('/api/utilisateurs', require('./routes/utilisateurRoutes'));
app.use('/uploads', express.static('uploads'));

// Synchronisation avec la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
        return sequelize.sync(); // Synchronise les modèles avec la base de données
    })
    .then(() => {
        console.log('Base de données synchronisée.');
        // Démarrage du serveur
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erreur lors de la connexion à la base de données :', error);
    });