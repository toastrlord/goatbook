const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: {type: Schema.Types.ObjectId, required: true},
    content: {type: Schema.Types.String, required: true, minLength: 1},
    date: {type: Schema.Types.String, required: true},
    likingUsers: {type: [Schema.Types.ObjectId]},
    responses: {type: [Schema.Types.ObjectId]}
});

PostSchema.virtual('url').get(function() {
    return '/posts/' + this._id;
});

exports.post = mongoose.user('Post', PostSchema);