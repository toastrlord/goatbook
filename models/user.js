const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, maxLength: 20},
    passwordHash: {type: String, required: true},
    friends: {type: [Schema.Types.ObjectId]},
    friendRequests: {type: [Schema.Types.ObjectId]}
});

UserSchema.virtual('url').get(function() {
    return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);