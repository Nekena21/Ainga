document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.getElementById('userList');
    const searchInput = document.getElementById('searchUserInput');
    let allUsers = [];

    // Fonction d'affichage
    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const div = document.createElement('div');
            div.classList.add('user-item');
            div.textContent = `${user.nom} ${user.prenom} (${user.mail})`;
            userList.appendChild(div);
        });
    }

    // Récupération des utilisateurs
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:5000/api/utilisateurs');
            const users = await response.json();
            allUsers = users;
            displayUsers(allUsers);
        } catch (error) {
            userList.textContent = 'Erreur de connexion au serveur.';
        }
    }

    // Recherche dynamique
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