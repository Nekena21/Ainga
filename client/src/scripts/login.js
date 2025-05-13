document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const mail = document.getElementById('mail').value;
    const mot_de_passe = document.getElementById('mot_de_passe').value;

    try {
        const response = await fetch('http://localhost:5000/api/utilisateurs/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail, mot_de_passe }),
        });

        const result = await response.json();

        if (response.ok && result.utilisateur) {
            localStorage.setItem('currentUser', JSON.stringify(result.utilisateur)); // Stocke l'utilisateur connecté
            if (mail === 'root@gmail.com' && mot_de_passe === 'admin') {
                window.location.href = 'users.html'; // Redirige vers la page admin
            } else {
                window.location.href = 'selectUser.html'; // Redirige vers la page normale
            }
        } else {
            console.error('Erreur lors de la connexion :', result.message || "Erreur lors de la connexion.");
            document.getElementById('loginMessage').textContent = result.message || "Erreur lors de la connexion.";
        }
    } catch (error) {
        console.error('Erreur :', error);
        document.getElementById('loginMessage').textContent = 'Erreur de connexion au serveur.';
    }
});