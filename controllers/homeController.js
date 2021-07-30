const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.home_get = function(req, res, next) {
    res.render('home');
}

exports.home_create_account_post = function(req, res, next) {
    body('username').trim().isLength({min: 10, max: 20}).withMessage('Please enter a username between 10 and 20 characters')
    .custom((value, {req}) => {
        User.find({'username': req.body.username})
        .exec(function (err, name) {
            if (err) { return next(err); }
            if (name === body.req.username) {
                throw new Error('Username is already taken');
            }
            return true;
        });
    }).withMessage('Username is already taken.').escape(),
    body('password').trim().isLength({min: 5, max: 20}).withMessage('Please enter a password between 5 and 20 characters long').escape(),
    body('confirm-password').trim().isLength({min: 5, max: 20}).custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return true;
    }), (req, res, next) => {
    }
}

exports.home_login_post = function(req, res, next) {

}

exports.home_create_account_get = function(req, res, next) {
    res.render('signup-form');
}