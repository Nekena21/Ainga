document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userMessage = document.getElementById('userMessage');
    const userList = document.getElementById('userList');

    // Fonction pour récupérer les utilisateurs
    async function fetchUsers() {
        userList.innerHTML = ''; // Réinitialise la liste
        try {
            const response = await fetch('http://localhost:5000/api/utilisateurs');
            if (response.ok) {
                const users = await response.json();
                users.forEach(user => {
                    const userItem = document.createElement('div');
                    userItem.textContent = `Nom : ${user.nom}, Prénom : ${user.prenom}, Email : ${user.mail}`;
                    userList.appendChild(userItem);
                });
            } else {
                userList.textContent = 'Erreur lors de la récupération des utilisateurs.';
            }
        } catch (error) {
            console.error('Erreur:', error);
            userList.textContent = 'Erreur de connexion au serveur.';
        }
    }

    // Fonction pour créer un utilisateur
    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const mail = document.getElementById('mail').value;
        const nom = document.getElementById('nom').value;
        const prenom = document.getElementById('prenom').value;
        const tel = document.getElementById('tel').value;
        const mot_de_passe = document.getElementById('mot_de_passe').value;

        try {
            const response = await fetch('http://localhost:5000/api/utilisateurs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mail, nom, prenom, tel, mot_de_passe }),
            });

            if (response.ok) {
                const result = await response.json();
                userMessage.textContent = 'Utilisateur créé avec succès : ' + result.message;
                userForm.reset();
                fetchUsers(); // Recharge la liste des utilisateurs
            } else {
                const errorData = await response.json();
                userMessage.textContent = 'Erreur : ' + errorData.message;
            }
        } catch (error) {
            console.error('Erreur:', error);
            userMessage.textContent = 'Erreur de connexion au serveur.';
        }
    });

    // Charger les utilisateurs au démarrage
    fetchUsers();
});