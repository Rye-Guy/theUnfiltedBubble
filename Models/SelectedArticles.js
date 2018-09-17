const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedArticleSchema = new Schema({
    savedTitle:{
        type: String,
        required: true,
        unique: true
    },
    savedDescription:{
        type: String,
        required: true,
        unique: true
    },
    savedUrl:{
        type: String,
        required: true,
        unique: true
    },
    savedPublication:{
        type: String,
        required: true
    },
    savedUser:{
        type: String
    }
},{
    versionKey: false,
    required: true
});

const SavedArticles = mongoose.model('Saved', SavedArticleSchema);

module.exports = SavedArticles;