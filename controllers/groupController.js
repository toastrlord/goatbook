const Group = require('../models/group');
const User = require('../models/user');
const {body, validationResult} = require('express-validator');
const async = require('async');

exports.group_summary_get = function(req, res, next) {
    Group.find({isPrivate: false})
    .exec((err, groups) => {
        if (err) { return next(err); }
        res.render('groups/group-summary', {groups});
    });
}

exports.group_detail_get = function(req, res, next) {
    async.parallel({
        currentUser: function(callback) {
            User.findById(req.user._id).exec(callback);
        },
        group: function(callback) {
            Group.findById(req.params.groupId).populate({
                path: 'members',
                populate: {
                    path: '_id',
                    model: 'User'
                }
            }).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        /*  
            need to change depending on the group options and priveleges
            is the group private? display a 'this group is private' page
            is the group not private? then:
                -if readonly, just display the posts and users
                -if member, display above AND also a 'post' button
                -if admin, display above AND ability to remove posts AND members/readonlys
                -if owner, display above AND ability to delete group with confirm 
        */
        const {group, currentUser} = results;
        const currentMember = group.members.filter(member => member.user._id === currentUser._id);
        console.log(group.members);
        if (group.isPrivate) {
            res.render('private group');
            return;
        }
        res.render('groups/group-detail', {
            groupName: group.name, 
            members: group.members, 
            permission: currentMember ? currentMember.permission : 'none'});
    });
}

exports.group_create_get = function(req, res, next) {
    res.render('groups/group-form');
}

exports.group_create_post = [
    body('name').notEmpty().isLength({min: 5, max: 30}).trim().escape().withMessage('Group names must be between 5 and 30 characters'),
    body('privacy').toBoolean(),
    (req, res, next) => { 
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const newGroup = new Group(
                {
                    name: req.body.name,
                    isPrivate: req.body.privacy,
                    posts: [],
                    members: [{user: req.user._id, permission: 'owner'}]
                });
            Group.create(newGroup, (err, theGroup) => {
                if (err) { return next(err); }
                res.redirect(theGroup.url);
            });
        }
        else {
            res.render('groups/group-form', { errors: errors.array() });
        }
    }  
];

exports.group_delete_post = function(req, res, next) {
    Group.findById(req.params.groupId).exec((err, theGroup) => {
        if (err) { next(err); }
        if (theGroup.members.filter(member => member.user._id === req.user._id && member.permission === 'owner')) {
            Group.delete({_id: req.params.groupId});
            res.redirect('/groups');
        }
        else {
            // TODO: render access denied error
            res.redirect('/groups');
        }
    });
}

exports.group_add_member_post = function(req, res, next) {
    Group.findById(req.params.groupId).exec((err, theGroup) => {
        if (err) { return next(err); }
        const member = theGroup.members.filter(member => member.user._id === req.user._id)[0];
        if (member.permission === 'owner' || member.permission === 'admin') {
            if (theGroup.members.filter(member => member.user._id = req.params.userId)) {
                // user is already in the group- don't add them again
                return res.redirect(theGroup.url);
            }
            Group.findByIdAndUpdate(theGroup._id, {$push: {members: {user: req.params.userId, permission: 'member'}}}, (err) => {
                if (err) { return next(err); }
                res.redirect(theGroup.url);
            });
        }
        else {
            // TODO: render access denied error
            res.redirect(theGroup.url);
        }
    });
}

// TODO: need to handle user leaving on their own- right now won't work unless they're an owner or admin
// also handle the owner trying to leave their own group- prevent this and prompt them to delete group instead
exports.group_remove_member_post = function(req, res, next) {
    Group.findById(req.params.groupId).exec((err, theGroup) => {
        if (err) { return next(err); }
        let validOperation = false;
        const member = theGroup.members.filter(member => member.user._id === req.user._id)[0];
        if (!member) {
            return res.redirect(theGroup.url);
        }
        if (member.user._id === req.params.userId) {
            // this user is leaving- allow them to do so, only if they do not have an "owner" permission level
            if (member.permission !== 'owner') {
                // TODO: show error message- must delete group if owner
                validOperation = true;
            }
        }
        else if (member.permission === 'owner' || member.permission === 'admin') {
            validOperation = true;
        }

        if (validOperation) {
            Group.findByIdAndUpdate(theGroup._id, {$pull: {members: {user: req.params.userId}}}, (err) => {
                if (err) { return next(err); }
                res.redirect(theGroup.url);
            });
        }
        else {
            // TODO: render access denied error
            res.redirect(theGroup.url);
        }
    });
}

exports.group_modify_member_post = function(req, res, next) {
    const newPermission = req.params.permission;
    // cannot set permission to owmer- this can only be achieved by creating a group
    if (newPermission === 'admin' || newPermission === 'member' || newPermission === 'readonly') {
        Group.findByIdAndUpdate(req.params.groupId, 
            {_id: req.params.userId},
            {$set: {permission: newPermission}}, (err, result) => {
                if (err) { return next(err); }
                res.redirect(result.url);
            });
    }
    else {
        // TODO: error!
        res.redirect(result.url);
    }
}