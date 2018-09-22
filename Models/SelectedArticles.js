const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedArticleSchema = new Schema({
    savedTitle:{
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
        type: String,
        required: true
    },
    comments:{
        type: Schema.Types.ObjectId,
        ref: "Comments",
        boolean: false
    },
    votes:{
        type: Schema.Types.ObjectId,
        ref: "Vote",
        boolean: true
    }
},{
    versionKey: false
});

const SavedArticles = mongoose.model('Saved', SavedArticleSchema);

module.exports = SavedArticles;