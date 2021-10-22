// Appel du model Password
const passwordSchema = require('../models/password');

// Si passwordSchema n'est pas valide alors on a un message d'erreur :
// Le mot de passe doit faire 8 caractères au moins, avec une majuscule, une minuscule et un chiffre au moins.
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le mot de passe doit faire 8 caractères au moins, avec une majuscule, une minuscule et un chiffre au moins.' });
    } else {
        next();
    }
};