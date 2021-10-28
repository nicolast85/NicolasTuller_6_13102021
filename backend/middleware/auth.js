// Package pour pouvoir vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Module dotenv pour éviter stocker des informations sensibles au sein de notre application
require('dotenv').config();

// Extration du token du header Authorization de la requête entrante. Il contiendra également 
// le mot-clé Bearer . Utilisation de la fonction split pour récupérer tout après l'espace dans 
// le header. Les erreurs générées ici s'afficheront dans le bloc catch.
// Utilisation de la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur
// sera générée 
// Extraction de l'ID utilisateur de notre token, si la demande contient un ID utilisateur nous le comparons à celui 
// extrait du token :
// - s'ils sont différents, nous générons une erreur
// - dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. 
// Nous passons l'exécution à l'aide de la fonction next() .
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};