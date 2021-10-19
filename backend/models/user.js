const mongoose = require('mongoose');
// Package mongoose-unique-validator pour pré-valider les informations avant de les enregistrer
// (Adresse e-mail unique et pallier les erreurs de MongoDB)
const uniqueValidator = require('mongoose-unique-validator');

// Pour s'assurer que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail, utilisation du
// mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Appliqué au schéma avant d'en faire un model
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);