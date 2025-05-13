document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.getElementById('userList');
    const searchInput = document.getElementById('searchUserInput');
    const currentUserData = localStorage.getItem('currentUser');
    let currentUserMail = '';
    let allUsers = [];

    if (currentUserData) {
        try {
            const userObj = JSON.parse(currentUserData);
            currentUserMail = userObj.mail;
        } catch (e) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
            return;
        }
    } else {
        window.location.href = 'login.html';
        return;
    }

    // Affiche la liste filtrée
    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            if (user.mail !== currentUserMail) { // Exclure l'utilisateur connecté
                const userDiv = document.createElement('div');
                userDiv.classList.add('user-item');
                userDiv.textContent = `${user.nom} ${user.prenom} (${user.mail})`;
                userDiv.addEventListener('click', () => {
                    window.location.href = `chat.html?mail_recepteur=${user.mail}`;
                });
                userList.appendChild(userDiv);
            }
        });
    }

    // Récupère tous les utilisateurs au chargement
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:5000/api/utilisateurs');
            const users = await response.json();
            allUsers = users;
            displayUsers(allUsers);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            userList.textContent = 'Erreur de connexion au serveur.';
        }
    }

    // Filtre à chaque saisie
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allUsers.filter(user =>
            (user.nom && user.nom.toLowerCase().includes(query)) ||
            (user.prenom && user.prenom.toLowerCase().includes(query)) ||
            (user.mail && user.mail.toLowerCase().includes(query))
        );
        displayUsers(filtered);
    });

    // Initialisation
    fetchUsers();
});