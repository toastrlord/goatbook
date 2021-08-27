const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {type: String, required: true, minLength: 5},
    members: [
        {
            user: 
            {
                type: Schema.Types.ObjectId, 
                required: true
            },
            permission: 
            {
                type: Schema.Types.String, 
                values: ['owner', 'admin', 'user', 'readonly'], 
                required: true
            }}],
    posts: [Schema.Types.ObjectId],
    isPrivate: {type: Schema.Types.Boolean, required: true}
});

GroupSchema.virtual('url').get(function() {
    return '/groups/' + this._id;
});

module.exports = mongoose.model('Group', GroupSchema);