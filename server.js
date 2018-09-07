const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');
const Twitter = require('twitter');
const session = require('express-session');
const exphbs = require("express-handlebars");
const routes = require('./controllers/router');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
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

(async function(){
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function (requestData) {
        //   console.info('Requesting', requestData.url);
    });

    //     const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    const status = await page.open('https://www.apnews.com/tag/apf-topnews');

    const content = await page.property('content');
    // console.log(content);

    //     const content = await page.property('content');
    //     // console.log(content);
    const $ = cheerio.load(content);

    //     const $  = cheerio.load(content);
    $('.contentArticle').each(function (i, element) {
        let articleEntry = {};
        // console.l3og(element);
        articleEntry.title = $(this).children('.contentTitle').text();
        articleEntry.description = $(this).children(".firstWords").text();
        articleUrl = $(this).attr("href");
        articleEntry.url = "https://www.apnews.com/" + articleUrl;
        // console.log(title);
        // console.log(titleText);
        // console.log("https://www.apnews.com/" + articleUrl);
        // console.log(articleEntry);
        
    });
    await instance.exit();
})();

  (async function() {
    const instance = await phantom.create();
    const page = await instance.createPage()
    await page.on('onResourceRequested', function(requestData){

    });
    const status = await page.open('https://www.atimes.com/');
    const content = await page.property('content');
    const $  = cheerio.load(content);

    $('.headline').each(function (i, element){
        let articleEntry = {};
        articleEntry.title = $(this).children("a").text();
        console.log(articleEntry);
    });
    await instance.exit();
  })();


client.get('statuses/user_timeline', {
    screen_name: 'nationalpost'
}, function (err, tweets, response) {
    if (err) console.log(err);

    tweets.forEach(element => {
        let articleEntry = {};
        articleEntry.publicationName = element.user.name;
        articleEntry.articleDescription = element.text;
        if(element.entities.urls[0] == undefined){
            articleEntry.url = "https://twitter.com/nationalpost";
        }else{
            articleEntry.url = element.entities.urls[0].expanded_url;
        }
        // console.log(articleEntry);
    });
});

app.use('/', routes);
app.listen(process.env.PORT | 8889, () => {
    console.log("Server is running!");
});