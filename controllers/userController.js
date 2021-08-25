const User = require('../models/user');
const async = require('async');

exports.user_get = function(req, res, next) {
    User.findById(req.params.id).populate({path: 'friendRequests friends', select: 'username'}).exec((err, user) => {
        if (err) { return next(err); }
        const {username, friendRequests, friends} = user;
        console.log(friendRequests);
        const isSelf = req.user._id === req.params.id;
        const isFriend = friends.filter(user => user.username === req.user.username).length;
        const requestSent = friendRequests.filter(user => user.username === req.user.username).length;
        res.render('user', {username, friendRequests, friends, isFriend, requestSent, currentUserId: req.user._id, id: req.params.id});
    });
}

exports.user_friend_request_update = function(req, res, next) {
    if (req.params.destUserId === req.originUserId) {
        res.redirect('/');
    }
    User.findByIdAndUpdate(req.params.destUserId, { $push: { friendRequests: req.user._id}}, 
        function(err, updatedUser) {
            if (err) { return next(err); }
            res.redirect(updatedUser.url);
    });
}

exports.user_friend_accept_update = function(req, res, next) {
    async.parallel({
        originUser: function(callback) {
            User.findByIdAndUpdate(req.params.originUserId, { $push: { friends: req.params.destUserId}}).exec(callback);
        },
        destUser: function(callback) {
            User.findByIdAndUpdate(req.params.destUserId, { $push: { friends: req.params.originUserId }, $pull: { friendRequests: req.params.originUserId }}).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.redirect(req.params.originUserId.url);
    });
}

exports.user_friend_ignore_update = function(req, res, next) {
    User.findByIdUpdate(req.params.destUserId, { $pull: { friendRequests: req.params.originUserId}}, 
        function(err, updatedUser) {
            if (err) { return next(err); }
            res.redirect(req.params.destUserID.url);
    });
}

exports.notifications_get = function(req, res, next) {
    User.findById(req.user._id).populate('friendRequests', 'username').exec((err, user) => {
        if (err) { return next(err); }
        res.render('notifications', {currentUserId: req.user._id, friendRequests: user.friendRequests});
    });
}

exports.user_friend_remove_update = function(req, res, next) {
    // TOOD: implement!
}