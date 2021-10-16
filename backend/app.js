// Import de express
const express = require('express');

// Package bodyParser pour être capables d'extraire l'objet JSON des demandes
const bodyParser = require('body-parser');

// Notre application expess
const app = express();

// Helmet nous aide à protéger notre application de certaines des vulnérabilités bien connues du Web 
// en configurant de manière appropriée des en-têtes HTTP
const helmet = require('helmet');

// Module Dotenv
require('dotenv').config();

//Mongoose est un package qui facilite les interactions avec notre base de données MongoDB grâce 
// à des fonctions extrêmement utiles.
const mongoose = require('mongoose');

// Import qui nous donnes accès au chemin de notre système de fichier
const path = require('path');

// Import du routeur (sauce)
const sauceRoutes = require('./routes/sauce');

// Import du routeur (user)
const userRoutes = require('./routes/user');

// Connection de notre API à notre cluster MongoDB
mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Headers permettant :
// - d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
// - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
// - d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware global pour notre application
app.use(bodyParser.json());

// Indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre 
// répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images 
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement de nos routeurs pour toutes les demandes effectuées vers :
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export pour pouvoir s'en servir dans nos autres fichiers
module.exports = app;