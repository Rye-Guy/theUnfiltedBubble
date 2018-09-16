const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedArticleSchema = new Schema({
    savedTitle:{
        type: String
    },
    savedDescription:{
        type: String
    },
    savedUrl:{
        type: String
    },
    savedPublication:{
        type: String
    }
},{
    versionKey: false
});

const SavedArticles = mongoose.model('Saved', SavedArticleSchema);

module.exports = SavedArticles;