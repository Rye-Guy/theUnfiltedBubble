const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');


const app = express();


app.use(bodyParser.urlencoded({extended: false}));


//    //Associated Press Link 
//     request("https://www.apnews.com", (err, response, html) => {
//             const $ = cheerio.load(html);
//             console.log(html);
//             $(".contentTitle .ng-binding .ng-scope").each((i, element) =>{
//                     console.log(element);
//             })
//     });


// (async function() {
//     const instance = await phantom.create();
//     const page = await instance.createPage();
//     await page.on('onResourceRequested', function(requestData) {
//       console.info('Requesting', requestData.url);
//     });
   
//     const status = await page.open('https://www.apnews.com/tag/apf-topnews');
    
//     const content = await page.property('content');
//     // console.log(content);
    
//     const $  = cheerio.load(content);
   
//     await instance.exit();
//   })();




app.listen(process.env.PORT | 8888, () => {
    console.log("Server is running!");
}); 
