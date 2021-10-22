// Création d'un routeur Express qui contiendra la logique de nos routes
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Vérification du password
const verifPassword = require('../controllers/password')

router.post('/signup', verifPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;