// Utilisation de Password-Validator
const passwordValidator = require('password-validator');
 
// Creation du schéma
const passwordSchema = new passwordValidator();
 
// Add properties to it
passwordSchema
.is().min(6)                                    // Taille minimum 6 caractères
.is().max(20)                                   // Taille maximum 20 caractères
.has().uppercase()                              // Doit avoir une majuscule
.has().lowercase()                              // Doit avoir une minuscule
.has().digits()                                 // Doit avoir un chiffre
.has().not().spaces()                           // Ne contient pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Mot de passe interdit

// Export de passwordSchema
module.exports = passwordSchema;