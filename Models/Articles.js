const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    articleTitle: {
        type: String,
        minlength: 1,
        unique: true,
        required: true
        
    },
    articleDescription: {
        type: String,
        minlength: 1, 
        unique: true
    },
    articleUrl:{
        type: String,
        required: true,
        unique: true
    },
    sourcePublication:{
        type: String
    }
},{
    versionKey: false
});

var Articles = mongoose.model('Articles', ArticleSchema);

module.exports = Articles;