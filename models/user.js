const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Post = require('./post')
/*const passportLocalMongoose = require('passport-local-mongoose');*/

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: String,
    lastname: String,
    description: String,
    //profilePicture: ImageSchema,
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Diverse']
    },
    age: Number,
    displayGender: {
        type: String,
        enum: ['Male', 'Female', 'Diverse', 'Display All']
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
})

module.exports = mongoose.model('User', UserSchema)