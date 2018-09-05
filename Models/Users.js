const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{
    versionKey: false
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
