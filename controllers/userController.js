const User = require('../models/user');
const async = require('async');

exports.user_get = function(req, res, next) {
    User.findById(req.params.id).populate('friendRequests','username').exec((err, user) => {
        if (err) { return next(err); }
        const {username, friendRequests, friends} = user;
        console.log(friendRequests);
        const isSelf = req.user._id === req.params.id;
        const isFriend = friends.includes(req.user.username);
        const requestSent = friendRequests.includes(req.user.username);
        res.render('user', {username, friendRequests, friends, isFriend, requestSent, currentUserId: req.user._id, id: req.params.id});
    });
}

exports.user_friend_request_update = function(req, res, next) {
    if (req.params.id === req.user._id) {
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
        originUser: User.findByIdAndUpdate(req.params.originUserId, { $push: { friends: req.params.destUserId}}, callback),
        destUser: User.findByIdAndUpdate(req.params.destUserId, { $push: { friends: req.params.originUserId }, $pull: { friendRequests: req.params.originUserId }})
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

exports.user_friend_remove_update = function(req, res, next) {
    // TOOD: implement!
}