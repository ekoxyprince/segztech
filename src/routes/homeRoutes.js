// Home Routes

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

router.get('/', homeController.getHomePage);
router.get('/about', homeController.getAboutPage);
router.get('/contact', homeController.getContactPage);
router.post('/contact', homeController.postContact);

module.exports = router;
