var express = require('express');
var router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.home_get);

router.get('/sign-up', homeController.home_create_account_get);

router.post('/sign-up', homeController.home_create_account_post);

module.exports = router;
