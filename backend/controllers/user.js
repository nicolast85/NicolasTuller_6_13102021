// Besoin de notre model User car on va enregistrer et lire des Users dans ses middlewares.
const User = require('../models/user');

// Package de chiffrement bcrypt pour hasher le password
const bcrypt = require('bcrypt');

// Package pour pouvoir créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Package CryptoJs, Bibliothèque JavaScript de normes cryptographiques pour chiffrer le mail
const cryptojs = require('crypto-js');

// Module dotenv pour éviter stocker des informations sensibles au sein de notre application
require('dotenv').config();

// Nos routes d'authentification :
// Utilisation de CryptoJs pour chiffrer le mail avec la variable emailCryptoJs, type d'algorithme : HmacSHA512
// Fonction de hachage de bcrypt dans notre mot de passe pour « saler » le mot de passe 10 fois. Plus la valeur 
// est élevée, plus l'exécution de la fonction sera longue mais plus le hachage sera sécurisé.
// Il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré :
// dans notre bloc then, nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant 
// une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec.
exports.signup = (req, res, next) => {
    // const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, process.env.SECRET_CRYPTOJS_TOKEN).toString(cryptojs.enc.Base64);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Utilisation de CryptoJs pour chiffrer le mail avec la variable emailCryptoJs, type d'algorithme : HmacSHA512
// Utilisation du modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur
// existant de la base de données : 
// - dans le cas contraire, nous renvoyons une erreur 401 Unauthorized
// - si l'e-mail correspond à un utilisateur existant, nous continuons :
// Utilisation de la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec
// le hash enregistré dans la base de données :
// - s'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un message « Mot de passe
// incorrect ! » ;
// - s'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, 
// nous renvoyons une réponse 200 contenant l'ID utilisateur et un token.
// Utilisation de la fonction sign dejsonwebtoken pour encoder le token, ce token contient l'ID de 
// l'utilisateur en tant que payload (les données encodées dans le token), nous utilisons une chaîne secrète
// de développement temporaire RANDOM_SECRET_KEY (dans le fichier .env) pour encoder notre token, nous
// définissons la durée de validité du token à 24 heures avec expiresIn. L'utilisateur devra donc se reconnecter 
// au bout de 24 heures.
exports.login = (req, res, next) => {
  // const emailCryptoJs = cryptojs.HmacSHA512(req.body.email, process.env.SECRET_CRYPTOJS_TOKEN).toString(cryptojs.enc.Base64);
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};