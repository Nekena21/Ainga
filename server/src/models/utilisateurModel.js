const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Utilisateur = sequelize.define('Utilisateur', {
    mail: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: true, // Définir 'mail' comme clé primaire
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    tel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    mot_de_passe: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'utilisateurs',
    timestamps: false,
});

module.exports = Utilisateur;