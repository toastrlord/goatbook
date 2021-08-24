var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

router.get('/', loginController.login_get);

router.post('/', loginController.login_post);

router.get('/sign-up', loginController.create_account_get);

router.post('/sign-up', loginController.create_account_post);

router.get('/logout', loginController.logout_get);

router.get('/home', homeController.home_get);

router.post('/search', homeController.search_post);

router.get('/users/:id', userController.user_get);

router.post('/users/addfriend/:destUserId/:originUserId', userController.user_friend_request_update);

router.post('/users/removefriend/:destUserId/:originUserId', userController.user_friend_remove_update);

router.post('/users/ignorerequest/:destUserId/:originUserId', userController.user_friend_ignore_update);

module.exports = router;
