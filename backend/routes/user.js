// Création d'un routeur Express qui contiendra la logique de nos routes
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
// Vérification de l'email
const verifEmail = require('../middleware/email');
// Vérification du password
const verifPassword = require('../middleware/password')

router.post('/signup', verifEmail, verifPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;