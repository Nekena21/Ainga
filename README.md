GESTIONCOURRIER


├── client
│   ├── src
│   │   ├── index.html       # Fichier HTML principal
│   │   ├── styles
│   │   │   └── style.css    # Fichier CSS pour le style
│   │   └── scripts
│   │       └── app.js       # Fichier JavaScript pour la logique côté client
│   ├── package.json         # Dépendances et scripts pour le client
│   └── README.md            # Documentation pour le client


├── server
│   ├── src
│   │   ├── app.js           # Point d'entrée du serveur
│   │   ├── controllers
│   │   │   └── mailController.js  # Contrôleur pour la gestion des courriers
│   │   ├── routes
│   │   │   └── mailRoutes.js      # Routes pour les API de gestion des courriers
│   │   └── models
│   │       └── mailModel.js       # Modèle de données pour les courriers
│   ├── package.json         # Dépendances et scripts pour le serveur
│   └── README.md            # Documentation pour le serveur
└── README.md                # Documentation générale du projet