const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    articleTitle: {
        type: String,
        unique: true
    },
    articleDescription: {
        type: String, 
        unique: true
    },
    articleUrl:{
        type: String,
        unique: true
    },
    sourcePublication:{
        type: String
    },
});

var Articles = mongoose.model('Articles', ArticleSchema);

module.exports = Articles;