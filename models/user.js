const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        // required: true,
        unique: true
    },
    username: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'diverse']
    },
    age: Number,
    interest: [String]
})

module.exports = mongoose.model('User', UserSchema)