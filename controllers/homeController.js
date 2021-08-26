const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

exports.home_get = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('home', { user: req.user.username, errors: req.session.errors });
    }
    else {
        res.redirect('/');
    }
}

exports.search_get = function(res, req, next) {

}

exports.search_post = [
    body('search').notEmpty(),
    body('type').custom((value, _) => {
        return value === 'users' || value === 'groups';
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        console.log(req.body);
        if (errors.isEmpty()) {
            switch(req.body.type) {
                case 'users':
                    User.find({ username: {'$regex': req.body.search, '$options': 'i'}}).exec((err, users) => {
                        if (err) { return next(err); }
                        res.render('search-results', { users: users});
                    });
                    break;
                case 'groups':
                    Group.find({ name: {'$regex': req.body.search, '$options': 'i'}, isPublic: true}).exec((err, groups) => {
                        if (err) { return next(err); }
                        res.render('search-results', { groups: groups });
                    });
                    break;
            }
        }
        else {
            req.session.errors = errors.array();
            res.redirect('/');
        }
    }
];