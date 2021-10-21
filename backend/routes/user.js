// Création d'un routeur Express qui contiendra la logique de nos routes
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Vérification du middlware password
const verifPassword = require('../middleware/password')

router.post('/signup', verifPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;