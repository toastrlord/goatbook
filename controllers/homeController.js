const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

exports.home_get = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('home', { user: req.user.username });
    }
    else {
        res.redirect('/');
    }
}

exports.search_get = function(res, req, next) {

}

exports.search_post = [
    body('search').isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req.body);
        if (errors.isEmpty()) {
            User.find({ username: {'$regex': req.body.search, '$options': 'i'}}).exec((err, users) => {
                if (err) { return next(err); }
                res.render('search-results', { users: users});
            });
        }
    }
];