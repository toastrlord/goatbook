const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mailer = require('../mailer');

const saltRounds = 10;

exports.login_get = function(req, res, next) {
    if (req.user) {
        res.redirect('/home');
    }
    else {
        res.render('login');
    }
}

exports.create_account_post = [
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

exports.login_post = [
    body('username').notEmpty().withMessage('Please enter a username').escape(),
    body('password').notEmpty().withMessage('Please enter a password').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('login', { errors: errors.array(), username: req.body.username});
        }
        else {
            passport.authenticate('local', {
                successRedirect: '/home',
                failureRedirect: '/'
            })(req, res, next);
        }
    }
];

exports.guest_login_get = [

];

exports.create_account_get = function(req, res, next) {
    res.render('signup-form');
}

exports.logout_get = function(req, res, next) {
    req.logout();
    res.redirect('/');
}