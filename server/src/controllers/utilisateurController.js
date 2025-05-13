const Utilisateur = require('../models/utilisateurModel');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt'); // Pour le hachage des mots de passe

exports.getAllUsers = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.findAll(); // Récupère tous les utilisateurs
        res.status(200).json(utilisateurs);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};


// Exemple d'utilisation de bcrypt pour hacher un mot de passe
exports.createUser = async (req, res) => {
    const { mail, nom, prenom, tel, mot_de_passe } = req.body;

    if (!mail || !nom || !prenom || !tel || !mot_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10); // Hachage du mot de passe
        const newUser = await Utilisateur.create({
            mail,
            nom,
            prenom,
            tel,
            mot_de_passe: hashedPassword,
        });
        res.status(201).json({ message: 'Utilisateur créé avec succès.', data: newUser });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Vérification du mot de passe lors de la connexion
exports.loginUser = async (req, res) => {
    console.log('loginUser appelé', req.body);
    const { mail, mot_de_passe } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({ where: { mail } });
        if (!utilisateur) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
        console.log('Utilisateur trouvé :', utilisateur);
        console.log('Mot de passe reçu :', mot_de_passe);
        console.log('Mot de passe hashé :', utilisateur.mot_de_passe);
        console.log('isPasswordValid :', isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // On retire le mot de passe avant d'envoyer l'utilisateur au frontend
        const { mot_de_passe: _, ...userSansMdp } = utilisateur.toJSON();

        // Ici, on envoie bien la clé "utilisateur"
        res.status(200).json({
            message: 'Connexion réussie',
            utilisateur: userSansMdp
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};