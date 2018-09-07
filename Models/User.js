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

UserSchema.statics.authenticate = function(username, password, callback){
    User.findOne({username: username}).exec(function(err, user){
        if(err){
            callback(err);
        }else if(!user){
            let err = new Error('User not found.');
            err.status = 401
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                return callback(null, user);
            }
            else{
                 return callback();
            }
        });
    });
}

const User = mongoose.model('User', UserSchema);
module.exports = User;