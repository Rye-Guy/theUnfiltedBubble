const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVotesSchema = new Schema({
    username:{
        type: String,
        required: true,
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