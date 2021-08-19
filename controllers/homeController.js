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