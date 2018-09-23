const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVotesSchema = new Schema({
    articleId:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        unique: true
    },
    votes:{
        type: Number,
        default: 0,
        required: true
    }
},{
    versionKey: false
});

const UserVotes = mongoose.model('Votes', UserVotesSchema);
module.exports = UserVotes;