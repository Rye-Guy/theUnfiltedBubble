const phantom = require('phantom');
const cheerio = require('cheerio');
const database = require('../Models/index');
const mongoose = require('mongoose');

(async function(){
    console.log('Hi')
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function (requestData) {});
    const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    const content = await page.property('content');
    const $ = cheerio.load(content);
    $('.contentArticle').each(function (i, element) {
        let articleEntry = {};
        articleEntry.articleTitle = $(this).children('.contentTitle').text();
        articleEntry.articleDescription = $(this).children(".firstWords").text();
        articleUrlHalf = $(this).attr("href");
        articleEntry.articleUrl = "https://www.apnews.com/" + articleUrlHalf;
        articleEntry.sourcePublication = 'The Associated Press';
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