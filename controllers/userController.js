const User = require('../models/user');

exports.user_get = function(req, res, next) {
    User.findById(req.params.id, (err, user) => {
        if (err) { return next(err); }
        res.render('user', {username: user.username});
    });
}