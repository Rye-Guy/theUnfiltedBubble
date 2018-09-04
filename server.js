const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');
const Twitter = require('twitter');


const app = express();


app.use(bodyParser.urlencoded({extended: false}));

var client = new Twitter({
    consumer_key: 'w2cIY20hmxjUBidNykzROyb3I',
    consumer_secret: '76YKgR71K0AzJpGoQo8DM2zLJfi2WvnjZGuqBNgD8GH4fvFAk4'
});

// (async function() {

//     const instance = await phantom.create();
//     const page = await instance.createPage()

//     await page.on('onResourceRequested', function(requestData) {
//     //   console.info('Requesting', requestData.url);
//     });
   
//     const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    
//     const content = await page.property('content');
//     // console.log(content);
    
//     const $  = cheerio.load(content);

//         $('.contentArticle').each((i, element) =>{
//             // console.l3og(element);
//             title = $(this).children('.contentTitle');
//             // titleText = $(this).children(".firstWords").text();
//             // articleLink = $(this).attr("href").val();
//             // console.log(title);
//             // console.log(titleText);
//             // console.log(articleLink);
//         });

//         // $('.cardContainer').each((i, element) =>{
//         //     title = $(this).children('.ng-scope').children('contentContainer').children('.articleWithoutPicture').children('contentArticle').children('.contentTitle').text();
            
//         //     console.log(title);
//         // });

//     await instance.exit();
//   })();

//   (async function(){
//     const instance = await phantom.create();
//     const page = await instance.createPage()
//     await page.on('onResourceRequested', function(requestData){

//     });
//     const status = await page.open('https://www.aljazeera.com/news/');
//     const content = await page.property('content');
//     const $  = cheerio.load(content);
        
//         $('.topics-sec-item-cont').each((i, element) =>{
//             link = $(this).children('a').attr('href');
//             title = $(this).children('a').children('.topics-sec-item-head').text();
//             console.log(link);
//             console.log(title);
//         });

//   })();

let params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});

client.get('favorites/list', function(error, tweets, response) {
    if(error) console.log(error);
    console.log(tweets);  // The favorites.
    console.log(response);  // Raw response object.
  });


app.listen(process.env.PORT | 8888, () => {
    console.log("Server is running!");
}); 

