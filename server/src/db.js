const { Sequelize } = require('sequelize');

// Configuration de la connexion à la base de données MySQL
const sequelize = new Sequelize('gestion_courrier', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Désactive les logs SQL dans la console
});

module.exports = sequelize;