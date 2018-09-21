const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCommentsSchema = new Schema({
    articleId:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    body:{
        type: String, 
        maxlength: 1500,
        required: true,
        unique: true
    },
    dateOfPost:{
        type: String,
        unique: true,
        required: true
    }
},{
    versionKey: false
});

const UserComments = mongoose.model('Comments', UserCommentsSchema);
module.exports = UserComments