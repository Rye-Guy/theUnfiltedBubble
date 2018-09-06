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


UserSchema.pre('save', function (next){
    let user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err){
            return err;
        }
        user.password = hash;
        next();
        console.log(hash);
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;