//phantom is our headless browser we use to go through our webpages that we are scrapping. The reason why I picked phantom is becasue it was really easy to use and it could get access to data on sites that have been built with frameworks like React and Angular. 
const phantom = require('phantom');
//cheerio so we can get navigate through the dom like a jQuery wizard on the backend. 
const cheerio = require('cheerio');
//pulling in our models so we can dump the data somewhere instantly as loop through the data. 
const database = require('../Models');
//good ol' mongoose. 
const mongoose = require('mongoose');
//async functions that runs in the background of the application. each function is a different site that we are scrapping. 
(async function(){
    //top 7 lines are all related to the phantom package. 
    const instance = await phantom.create();
    const page = await instance.createPage();
    //create the pages and load the data. 
    await page.on('onResourceRequested', function (requestData) {});
    //our source where we are grabbing the articles from. 
    const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    const content = await page.property('content');
    //now we take the content that phantom returns and use cheerio to loop through the data. 
    const $ = cheerio.load(content);
    $('.contentArticle').each(function (i, element) {
    //create an empty object for each article we are creating. 
        let articleEntry = {};
        //putting our data into the oject
        articleEntry.articleTitle = $(this).children('.contentTitle').text();
        articleEntry.articleDescription = $(this).children(".firstWords").text();
        articleUrlHalf = $(this).attr("href");
        articleEntry.articleUrl = "https://www.apnews.com/" + articleUrlHalf;
        articleEntry.sourcePublication = 'The Associated Press';
        //mongoose time. create the entry in our main articles db. 
        database.Articles.create(articleEntry).then(function(article){
            console.log(article);
            console.log('scrapping occurred');
        }).catch(function(err){
            console.log(err);
        });
    });

    await instance.exit();
    
})();
//rest of this code is exactly the same expect for sources chosen and how we use cheerio to access the elements is unique on every page we scrape. 
(async function() {
    const instance = await phantom.create();
    const page = await instance.createPage()
    await page.on('onResourceRequested', function(requestData){});
    const status = await page.open('https://www.atimes.com/');
    const content = await page.property('content');
    const $  = cheerio.load(content);
    $('.item-content').each(function (i, element){
        let articleEntry = {};
        articleEntry.articleTitle = $(this).children('.headline').children("a").text();
        articleEntry.articleUrl = $(this).children('.headline').children('a').attr('href'); 
        articleEntry.articleDescription = $(this).children('.underline').children('a').text();
        articleEntry.sourcePublication = 'Asia Times';
        database.Articles.create(articleEntry).then(function(article){
            console.log(article);
            console.log('scrapping occurred');
        }).catch(function(err){
            console.log(err);
        });
    });

    await instance.exit();

  })();

  (async function() {
    const instance = await phantom.create();
    const page = await instance.createPage()
    await page.on('onResourceRequested', function(requestData){});
    const status = await page.open('https://www.mintpressnews.com/category/highlights/');
    const content = await page.property('content');
    const $  = cheerio.load(content);
    $('.post').each(function (i, element){
        let articleEntry = {}
        articleEntry.articleTitle = $(this).children('.entry-title').children('a').text();
        articleEntry.articleUrl = $(this).children('.entry-title').children('a').attr('href');
        articleEntry.articleDescription = $(this).children('.single-excerpt').children('p').text();
        articleEntry.sourcePublication = 'MintPress News';
        console.log(articleEntry);
        database.Articles.create(articleEntry).then(function(article){
            console.log(article);
            console.log('scrapping occurred');
        }).catch(function(err){
            console.log(err);
        });
    });

    await instance.exit();

  })();