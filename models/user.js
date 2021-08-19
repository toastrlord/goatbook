const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, maxLength: 20},
    passwordHash: {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema);