const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Courrier = sequelize.define('Courrier', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    objet: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    date_reception: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    statut: {
        type: DataTypes.ENUM('en cours', 'envoyé', 'non envoyé', 'supprimé'),
        allowNull: true,
        defaultValue: 'en cours',
    },
    fichier_joint: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    mail_envoyeur: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mail_recepteur: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'courriers',
    timestamps: false,
});

module.exports = Courrier;