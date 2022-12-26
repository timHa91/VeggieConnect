const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    date: Date
})

module.exports = mongoose.model('Post', PostSchema);