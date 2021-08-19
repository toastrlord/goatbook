const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

exports.home_get = function(req, res, next) {
    res.render('home');
}

exports.home_create_account_post = [
    body('username').trim().isLength({min: 10, max: 20}).withMessage('Please enter a username between 10 and 20 characters').escape()
    .custom(value => {
        return User.exists({username: value}).then(user => {
            if (user) {
                return Promise.reject('Username is already taken');
            }
        });
    }),
    body('password').trim().isLength({min: 5, max: 20}).withMessage('Please enter a password between 5 and 20 characters long').escape(),
    body('confirm-password').trim().isLength({min: 5, max: 20}).custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match!');
        }
        return true;
    }), 
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                const newUser = new User({
                    username: req.body.username,
                    passwordHash: hash
                });
                User.create(newUser, (err, theUser) => {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            });
        }
        else {
            res.render('signup-form', {errors: errors.array()});
        }
        
    }
];

exports.home_login_post = function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    });
}

exports.home_create_account_get = function(req, res, next) {
    res.render('signup-form');
}