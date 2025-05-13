document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const mail = document.getElementById('mail').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const tel = document.getElementById('tel').value;
    const mot_de_passe = document.getElementById('mot_de_passe').value;

    try {
        const response = await fetch('http://localhost:5000/api/utilisateurs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail, nom, prenom, tel, mot_de_passe }),
        });

        if (response.ok) {
            document.getElementById('registerMessage').textContent = 'Inscription réussie ! Redirection...';
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirige vers la page de connexion
            }, 2000);
        } else {
            document.getElementById('registerMessage').textContent = 'Erreur lors de l\'inscription.';
        }
    } catch (error) {
        console.error('Erreur :', error);
        document.getElementById('registerMessage').textContent = 'Erreur de connexion au serveur.';
    }
});