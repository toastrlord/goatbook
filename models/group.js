const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {type: String, required: true, minLength: 5},
    members: [Schema.Types.ObjectId],
    posts: [Schema.Types.ObjectId],
});

GroupSchema.virtual('url').get(function() {
    return '/groups/' + this._id;
});

module.exports = mongoose.model('Group', GroupSchema);