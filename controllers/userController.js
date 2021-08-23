const User = require('../models/user');
const async = require('async');

exports.user_get = function(req, res, next) {
    User.findById(req.params.id, (err, user) => {
        if (err) { return next(err); }
        res.render('user', {username: user.username});
    });
}

exports.user_friend_request_update = function(req, res, next) {
    User.findByIdAndUpdate(req.params.destUserId, { $push: { friendRequests: req.params.originUserId}}, 
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