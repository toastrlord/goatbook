var express = require('express');
const userController = require('../controllers/userController');
var router = express.Router();

router.post('/users/addfriend/:destUserId/:originUserId', userController.user_friend_request_update);

router.post('/users/removefriend/:destUserId/:originUserId', userController.user_friend_remove_update);

router.post('/users/ignorerequest/:destUserId/:originUserId', userController.user_friend_ignore_update);

router.post('/users/acceptrequest/:destUserId/:originUserId', userController.user_friend_accept_update);


module.exports = router;
