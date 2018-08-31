const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');


const app = express();


app.use(bodyParser.urlencoded({extended: false}));


//    //Associated Press Link 

// var options = {
//     url: 'https://www.apnews.com/tag/apf-topnews',
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'
//     }
//   };

//     request(options, (err, response, html) => {
//             const $ = cheerio.load(html);
//             console.log(html, response);
//             $("p").each((i, element) =>{
//                     console.log(element);
//             });
//     });


(async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onResourceRequested', function(requestData) {
    //   console.info('Requesting', requestData.url);
    });
   
    const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    
    const content = await page.property('content');
    // console.log(content);
    
    const $  = cheerio.load(content);
    
        $('.contentArticle').each(function(i, element){
            // console.l3og(element);
            title = $(this).children('.contentTitle').text();
            titleText = $(this).children(".firstWords").text();
            articleLink = $(this).attr("href").val();
            console.log(title);
            console.log(titleText);
        });
   
    await instance.exit();
  })();




app.listen(process.env.PORT | 8888, () => {
    console.log("Server is running!");
}); 
