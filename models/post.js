const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    contribute: String
})

module.exports = mongoose.model("Post", PostSchema);