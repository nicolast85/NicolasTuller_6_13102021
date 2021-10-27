// Import de Express-rate-limit pour limiter le nombre de requête que peut faire un utilisateur et ainsi
// empêcher les attaques de type spam avec des requêtes en boucle
const rateLimit = require("express-rate-limit");

// L'utilisateur pourra faire 10 requêtes toutes les 5 minutes
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
});

module.exports = limiter;