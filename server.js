const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Twitter = require('twitter');
const session = require('express-session');
const exphbs = require("express-handlebars");
const routes = require('./controllers/router');
const dataScraping = require('./controllers/scapingIntoDB');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/theUnfilteredDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () =>{
    console.log('db connected');
});

app.use(session({
    secret: 's9Kwp09n3zcM',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

const client = new Twitter({
    consumer_key: 'w2cIY20hmxjUBidNykzROyb3I',
    consumer_secret: '76YKgR71K0AzJpGoQo8DM2zLJfi2WvnjZGuqBNgD8GH4fvFAk4',
    access_token_key: '1007388564500434944-k7jxNM1OSzSvtOBT2FpA9ONwRDZh8N',
    access_token_secret: '2GjUQiVkK0Ha0OY1j6jyzLR5Zl85Fyw8JFImeUkbs8hpq'
});


// client.get('statuses/user_timeline', {
//     screen_name: 'nationalpost'
// }, function (err, tweets, response) {
//     if (err) console.log(err);

//     tweets.forEach(element => {
//         let articleEntry = {};
//         console.log(element);
//         articleEntry.publicationName = element.user.name;
//         articleEntry.articleDescription = element.text;
//         if(element.entities.urls[0] == undefined){
//             articleEntry.url = "https://twitter.com/nationalpost";
//         }else{
//             articleEntry.url = element.entities.urls[0].expanded_url;
//         }
//         console.log(articleEntry);
//     });
// });

app.get(dataScraping);
app.use('/', routes);
app.listen(process.env.PORT | 8889, () => {
    console.log("Server is running!");
});