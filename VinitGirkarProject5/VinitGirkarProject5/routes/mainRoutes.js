const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController');


//GET /: redirects to the home page
router.get('/', controller.index);

//GET /contact: redirects to the contact page
router.get('/contact', controller.contact);

//POST /about: redirects to the about page
router.get('/about', controller.about);

//GET /privacy: redirects to the privacy policy page
router.get('/privacy', controller.privacy);

//GET /pricing: redirects to the pricing page
router.get('/pricing', controller.pricing);

module.exports=router;  