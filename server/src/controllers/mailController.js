const Courrier = require('../models/courrierModel');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Récupérer les messages (avec recherche)
exports.recupererMessages = async (req, res) => {
    const { mail_envoyeur, mail_recepteur, query } = req.query;
    if (!mail_envoyeur || !mail_recepteur) {
        return res.status(400).json({ message: 'Champs requis.' });
    }
    try {
        const where = {
            [Op.or]: [
                { mail_envoyeur, mail_recepteur },
                { mail_envoyeur: mail_recepteur, mail_recepteur: mail_envoyeur }
            ]
        };
        if (query) {
            where[Op.and] = [
                {
                    [Op.or]: [
                        { objet: { [Op.like]: `%${query}%` } }
                    ]
                }
            ];
        }
        const messages = await Courrier.findAll({
            where,
            order: [['date_reception', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Créer un message (avec fichier)
exports.createMail = async (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    try {
        const { objet, reference, statut, mail_envoyeur, mail_recepteur } = req.body;
        let fichier_joint = null;
        if (req.file) fichier_joint = req.file.filename;

        // Empêcher l'envoi d'un message totalement vide
        if ((!objet || objet.trim() === '') && (!fichier_joint || fichier_joint === '')) {
            return res.status(400).json({ message: 'Message vide.' });
        }
        const newCourrier = await Courrier.create({
            objet,
            reference,
            date_reception: new Date(),
            statut: statut || 'en cours',
            fichier_joint,
            mail_envoyeur,
            mail_recepteur
        });
        res.status(201).json({ message: 'Courrier créé avec succès.', data: newCourrier });
    } catch (error) {
        console.error('Erreur lors de la création du courrier :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Modifier un message
exports.updateMail = async (req, res) => {
    try {
        const { objet } = req.body;
        const { id } = req.params;
        const courrier = await Courrier.findByPk(id);
        if (!courrier) return res.status(404).json({ message: 'Message non trouvé.' });
        courrier.objet = objet;
        await courrier.save();
        res.status(200).json({ message: 'Message modifié.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Supprimer un message
exports.deleteMail = async (req, res) => {
    try {
        const { id } = req.params;
        const courrier = await Courrier.findByPk(id);
        if (!courrier) return res.status(404).json({ message: 'Message non trouvé.' });
        // Supprimer le fichier joint si existe
        if (courrier.fichier_joint) {
            const filePath = path.join(__dirname, '../../uploads/', courrier.fichier_joint);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await courrier.destroy();
        res.status(200).json({ message: 'Message supprimé.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.getAllMails = async (req, res) => {
    try {
        const courriers = await Courrier.findAll();
        res.status(200).json(courriers);
    } catch (error) {
        console.error('Erreur lors de la récupération des courriers:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};