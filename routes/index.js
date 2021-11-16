var express = require('express');
var router = express.Router();
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');
const groupController = require('../controllers/groupController');

router.get('/', loginController.login_get);

router.post('/', loginController.login_post);

// TODO: implement and redirect!
router.get('/guest', loginController.guest_login_get);

router.get('/sign-up', loginController.create_account_get);

router.post('/sign-up', loginController.create_account_post);

router.get('/logout', loginController.logout_get);

router.get('/home', homeController.home_get);

router.post('/search', homeController.search_post);

router.get('/users/:id', userController.user_get);

router.get('/notifications', userController.notifications_get);

router.get('/groups', groupController.group_summary_get);

router.get('/groups/create', groupController.group_create_get);

router.post('/groups/create', groupController.group_create_post);

router.get('/groups/invite/:groupId', groupController.group_invite_get);

router.post('/groups/addmember/:userId/:groupId', groupController.group_add_member_post);

router.post('/groups/removemember/:userId/:groupId', groupController.group_remove_member_post);

router.post('/groups/modifymember/:userId/:groupId', groupController.group_modify_member_post);

router.get('/groups/:groupId', groupController.group_detail_get);

module.exports = router;
