const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');


const app = express();


app.use(bodyParser.urlencoded({extended: false}));


(async function() {
    
    const instance = await phantom.create();
    const page = await instance.createPage()
    //on function you can listen to the events that the page emits. 
    await page.on('onResourceRequested', function(requestData) {
    //   console.info('Requesting', requestData.url);
    });
   
    const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    
    const content = await page.property('content');
    // console.log(content);
    
    const $  = cheerio.load(content);

        $('.contentArticle').each((i, element) =>{
            // console.l3og(element);
            title = $(this).children('.contentTitle');
            // titleText = $(this).children(".firstWords").text();
            // articleLink = $(this).attr("href").val();
            console.log(title);
            // console.log(titleText);
            // console.log(articleLink);
        });

        // $('.cardContainer').each((i, element) =>{
        //     title = $(this).children('.ng-scope').children('contentContainer').children('.articleWithoutPicture').children('contentArticle').children('.contentTitle').text();
            
        //     console.log(title);
        // });

    await instance.exit();
  })();

  




app.listen(process.env.PORT | 8888, () => {
    console.log("Server is running!");
}); 
