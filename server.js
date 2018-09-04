const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');
const Twitter = require('twitter');


const app = express();


app.use(bodyParser.urlencoded({
    extended: false
}));

var client = new Twitter({
    consumer_key: 'w2cIY20hmxjUBidNykzROyb3I',
    consumer_secret: '76YKgR71K0AzJpGoQo8DM2zLJfi2WvnjZGuqBNgD8GH4fvFAk4',
    access_token_key: '1007388564500434944-k7jxNM1OSzSvtOBT2FpA9ONwRDZh8N',
    access_token_secret: '2GjUQiVkK0Ha0OY1j6jyzLR5Zl85Fyw8JFImeUkbs8hpq'
});

(async function () {
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
        // console.l3og(element);
        title = $(this).children('.contentTitle').text();
        titleText = $(this).children(".firstWords").text();
        articleUrl = $(this).attr("href");
        console.log(title);
        console.log(titleText);
        console.log("https://www.apnews.com/" + articleUrl);
    });
    await instance.exit();
})();

  (async function(){
    const instance = await phantom.create();
    const page = await instance.createPage()
    await page.on('onResourceRequested', function(requestData){

    });
    const status = await page.open('https://www.aljazeera.com/news/');
    const content = await page.property('content');
    const $  = cheerio.load(content);

        $('.top-sec-title').each((i, element) =>{
            title = $(this).text();
            console.log(title);
        });
  })();


client.get('statuses/user_timeline', {
    screen_name: 'nationalpost'
}, function (err, tweets, response) {
    if (err) console.log(err);

    tweets.forEach(element => {
        console.log(element.user.name);
        console.log(element.text);
        console.log(element.entities.urls[0].expanded_url);
    });
    // console.log(response);
});


app.listen(process.env.PORT | 8888, () => {
    console.log("Server is running!");
});