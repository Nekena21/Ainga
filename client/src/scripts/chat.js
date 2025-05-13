document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const fileInput = document.getElementById('fileInput');
    const searchInput = document.getElementById('searchInput');
    const recordBtn = document.getElementById('recordBtn');
    const audioPreview = document.getElementById('audioPreview');

    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];

    // Récupérer infos utilisateur
    const urlParams = new URLSearchParams(window.location.search);
    const mail_recepteur = urlParams.get('mail_recepteur');
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
        alert('Vous devez être connecté pour accéder à cette page.');
        window.location.href = 'login.html';
        return;
    }
    const currentUser = JSON.parse(currentUserData);
    const mail_envoyeur = currentUser?.mail;

    // Recherche de messages
    searchInput.addEventListener('input', async (event) => {
        fetchMessages(event.target.value);
    });

    // Affichage des messages
    async function fetchMessages(query = '') {
        try {
            let url = `http://localhost:5000/api/mails/messages?mail_envoyeur=${mail_envoyeur}&mail_recepteur=${mail_recepteur}`;
            if (query) url += `&query=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erreur lors de la récupération des messages');
            const messages = await response.json();
            chatBox.innerHTML = '';
            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message-bubble');
                if (message.mail_envoyeur === mail_envoyeur) {
                    messageDiv.classList.add('sent');
                } else {
                    messageDiv.classList.add('received');
                }
                // Affichage du objet
                let content = `<span class="sender">${message.mail_envoyeur === mail_envoyeur ? 'Moi' : message.mail_envoyeur}</span><br>`;
                if (message.fichier_joint) {
                    const ext = message.fichier_joint.split('.').pop().toLowerCase();
                    if (['jpg','jpeg','png','gif','bmp','webp'].includes(ext)) {
                        content += `<img src="http://localhost:5000/uploads/${message.fichier_joint}" alt="image" style="max-width:150px;max-height:150px;"/><br>`;
                    } else if (['mp4','webm','ogg'].includes(ext)) {
                        content += `<video controls src="http://localhost:5000/uploads/${message.fichier_joint}" style="max-width:200px;"></video><br>`;
                    } else if (['mp3','wav','ogg','m4a','webm'].includes(ext)) {
                        content += `<audio controls src="http://localhost:5000/uploads/${message.fichier_joint}"></audio><br>`;
                    } else {
                        content += `<a href="http://localhost:5000/uploads/${message.fichier_joint}" target="_blank">Fichier joint</a><br>`;
                    }
                }
                content += `${message.objet || ''}`;

                messageDiv.innerHTML = content;

                // Boutons édition/suppression pour l'utilisateur connecté
                if (message.mail_envoyeur === mail_envoyeur) {
                    const editBtn = document.createElement('button');
                    editBtn.textContent = '✏️';
                    editBtn.onclick = () => editMessage(message);
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '🗑️';
                    deleteBtn.onclick = () => deleteMessage(message.id);
                    messageDiv.appendChild(editBtn);
                    messageDiv.appendChild(deleteBtn);
                }
                chatBox.appendChild(messageDiv);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des messages :', error);
        }
    }

    // Envoi de message (texte + fichier)
    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const objet = messageInput.value;
        const file = fileInput.files[0];

        const formData = new FormData();
        // formData.append('objet', 'Message');
        formData.append('objet', objet);
        formData.append('mail_envoyeur', mail_envoyeur);
        formData.append('mail_recepteur', mail_recepteur);
        if (file) formData.append('fichier_joint', file);

        try {
            const response = await fetch('http://localhost:5000/api/mails', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');
            messageInput.value = '';
            fileInput.value = '';
            fetchMessages();
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
        }
    });

    // Enregistrement vocal
    recordBtn.addEventListener('click', async () => {
        if (!isRecording) {
            if (!navigator.mediaDevices) {
                alert('Enregistrement audio non supporté');
                return;
            }
            isRecording = true;
            recordBtn.textContent = '⏹️';
            audioChunks = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                audioPreview.src = URL.createObjectURL(audioBlob);
                audioPreview.style.display = 'block';
                // Envoi du vocal
                const formData = new FormData();
                formData.append('objet', '[Message vocal]');
                formData.append('mail_envoyeur', mail_envoyeur);
                formData.append('mail_recepteur', mail_recepteur);
                formData.append('fichier_joint', audioBlob, 'vocal.webm');
                try {
                    const response = await fetch('http://localhost:5000/api/mails', {
                        method: 'POST',
                        body: formData,
                    });
                    if (!response.ok) throw new Error('Erreur lors de l\'envoi du vocal');
                    fetchMessages();
                } catch (error) {
                    console.error('Erreur lors de l\'envoi du vocal :', error);
                }
            };
            mediaRecorder.start();
            setTimeout(() => {
                if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
                isRecording = false;
                recordBtn.textContent = '🎤';
            }, 5000); // 5 secondes max
        } else {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                isRecording = false;
                recordBtn.textContent = '🎤';
            }
        }
    });
    // Modifier un message
    async function editMessage(message) {
        const nouveauTexte = prompt('Modifier le message :', message.objet || '');
        if (nouveauTexte !== null) {
            try {
                const response = await fetch(`http://localhost:5000/api/mails/${message.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ objet: nouveauTexte }),
                });
                if (!response.ok) throw new Error('Erreur lors de la modification');
                fetchMessages();
            } catch (error) {
                console.error('Erreur lors de la modification :', error);
            }
        }
    }

    // Supprimer un message
    async function deleteMessage(id) {
        if (confirm('Supprimer ce message ?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/mails/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Erreur lors de la suppression');
                fetchMessages();
            } catch (error) {
                console.error('Erreur lors de la suppression :', error);
            }
        }
    }

    // Initialisation
    fetchMessages();
});