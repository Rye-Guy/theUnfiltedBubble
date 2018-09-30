//get our express up in here!
const express = require('express');
//we want the router too! Its its expresses cooler younger sibling. 
const router = express.Router();
//get access to our models in our index file. 
const database = require('../Models/index');
//npm package that gives us access to local storage on the server side. This has a few benefits as we can save user searches on the back and serve relevent data back to the users. 
const LocalStorage = require('node-localstorage').LocalStorage;
//creates a folder where our client search data is stored. 
localStorage = new LocalStorage('./clientStoredSearch');

//middleware object used to store custom middleware functions. Only really used it to contain one but it can easily be modified now if I wanted to add more middleware. 
const middleware = {
    requiresLogin: (req, res, next) =>{
        //see if the session is created and if the userId has been added to our session oject. 
        if(req.session && req.session.userId){
            console.log('Middleware doing its stuff :D');
            return next();
        }else{
        //send people to an error page when trying to hit pages that require users to be logged in. 
            let err = new Error('You must be logged in to view this page.');
            err.status = 401;
            res.redirect('/error');
            return next(err);
        }
    }
}

//get route for our index. 
router.get('/', (req, res, next) =>{
    //if we have a userId in our session then send our registered users to our home page instead of login. 
    if(req.session.userId){
        res.render('home');
        // res.cookie('username', req.session.usernameLogged, {expires: new Date(Date.now() + 900000), httpOnly: true});
    }else{
    //I only want the login page to appear in the index route when there is no userId in the session. 
    res.render('login');
    }
});

//how are we going to handle users authentication. Lets break this put into smaller pieces. 
router.post('/', (req, res, next) =>{
    //error that gets produced when the user registering passwords do not match. Don't want to send a miss spelled user password to our DB
    if(req.body.password !== req.body.confirmPassword){
        let err = new Error('Passwords do not match!');
        err.status = 400; 
        res.render('login');
    }
    //next possibility that is prepared is creating users from the related form on the login paged
    else if(req.body.username && req.body.password){
         //grab our request body and build a user object that will be send to our data base.
             let userData = {
                username: req.body.username, 
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
             }
        //if we have made it to this part then the user data should be good to go and we can create our user. 
             database.User.create(userData, (err, user) => {
                 if(err){
                     return res.send(err);
                 }else{
                //important things need to happen with our newly created user. 
                //store our newly created username in a new variable.
                     usernameLog = req.body.username; 
                //this next line is the way our users are able to get around. Use the _id created by mongo to create unique user IDs that get added to our session object.  
                     req.session.userId = user._id;
                //add the username while were at it. It might come useful later to have access to a given user name of logged in user.
                     req.session.usernameLogged = user.username;
                //now we got what we needed to done. Send the user to the action!!! 
                     return res.render('home');
                 }
             });
    //what about our other way of logging in. Not a registering user but someone returning to our website.
    }else if(req.body.logusername && req.body.logpassword){
        //now lets to some real authentication. Here. No longer are we creating users but seeing if they are already in our db
        database.User.authenticate(req.body.logusername, req.body.logpassword, (error, user)=>{
            //if we have an error or our callback returns no user. The authenticate method will give us an error if the logusername or logpassword does not match what is in our database. 
            if(error || !user){
                let err = new Error('Wrong email or password.')
                err.status = 401;
                res.render('login');
            }else{
            //lets create tho much needed session objects we use to allow the user to actually get into our home page. 
                req.session.userId = user._id;
                req.session.usernameLogged = user.username;
                return res.redirect('/home');
            }
        });
    }else{
    //if all goes wrong here then send this error. 
        let err = new Error('All Fields Required');
        err.status = 400;
        return res.send(err);
    }
});

//get route for serving the saved articles HBS file
router.get('/savedArticles', middleware.requiresLogin, (req, res)=>{
    return res.render('savedArticles');
});

//post route that handles user votes to the DB. 
router.post('/userVotes/:id', middleware.requiresLogin, (req, res)=>{
    //finds the related article and updates the vote column to either plus one or minus one.
    database.SavedArticles.findByIdAndUpdate({'_id': req.body._id},{'votes': parseInt(req.body.votes)}).exec((err, doc)=>{
        if(err){
            res.send(err);
        }else{
            res.send(doc);
        }
   });

});

//this route matches all the current saved articles with comments attached and populates all of the comments with the same Id as their parent container. 
router.get('/getSavedComments/:id', function(req, res){ 
//go get all the comments with te same id from our request. 
    database.Comments.find({'articleId': req.params.id}).then(function (result){
        res.json(result);
    }).catch(function(err){
        console.log(err);
        res.json(err);
    });
    
});

//create a comment lets do this!!!
Comment = database.Comments;
router.post('/savedArticles/:id', middleware.requiresLogin, (req, res)=>{
    //crate a new comment out of our request body save it to our comments database. Create the new comment post with all of our keys pieces of data.
    let newComment = new Comment(req.body);
    newComment.save(function(err, doc){
        if(err){
            res.send(err);
        }else{
            console.log(doc);
            res.send(doc);
        }
    })
});

//route used just for getting the current sign in users json data to every page. Our getUserName.js file in publics utilizes this route. 
router.get('/getUser', middleware.requiresLogin, (req, res) =>{
    res.json(req.session.usernameLogged);
});

//get route that gets our scapped data with all of the current articles from our parent database
router.get('/getArticles', (req, res) =>{
//simple here just find everything and serve it as json data 
    database.Articles.find({}).then((dbArticles) =>{
        res.json(dbArticles);
        console.log('articles found!');
    }).catch(function(err){
        res.json(err);
    });
});

//create a variable to store new articles that users save to the savedArticles database. 
const SavedArticles = database.SavedArticles;
//post route that takes find the article Id of whichever saved article button is hit. 
router.post('/getArticles/:id', (req, res) =>{
    //create a new object from our request body with the saved article JSON data which is bascially the same as the articles but with a couple more pieces of information tied to them. 
    let newArticle = new SavedArticles(req.body);
    //new article created in our Saved articles database
    SavedArticles.create(newArticle, (err, savedArticle) =>{
        if(err){
            res.send(err);
            console.log(err);
        }else{
            res.send(savedArticle);
            console.log(savedArticle);
        }
    });
});

//get route for the saved articles very similar to our home page get route expect now we are grabbing articles and sorting them based on their vote value in descending order. 
router.get('/getSavedArticles', middleware.requiresLogin, (req, res, next) =>{
    //our sort that does the magic
    database.SavedArticles.find({}).sort({'votes': -1}).then((savedArticles) =>{
        res.json(savedArticles);
    }).catch((err) =>{
        res.send(err);
    })
});

//get route for our search. it sends the related user search data that was generated from their post. This takes the stringified json data and parses it then sends that back to the user. localstorage is used on the backend to keep track of every users searches. Files are overwritten for every unique user search. 
router.get('/search', middleware.requiresLogin, (req, res, next)=>{
    res.json(JSON.parse(localStorage.getItem('searchData'+req.session.usernameLogged)));
}); 
//post route that handles our user inputted search. grabs the req.body.searchInput and makes our search system function and creates client search data. 
router.post('/search', middleware.requiresLogin, (req, res, next)=>{
    if(req.body.searchInput){
//finds the related text in the databases and sends it back.
    database.Articles.find({$text: {$search: req.body.searchInput}}).then((result)=>{
//use our localStorage npm package to take control of localstorage on our node server. 
//creates unique file names for every user who actually preforms searches on the site. 
        localStorage.setItem('searchData'+req.session.usernameLogged, JSON.stringify(result));
//render the searchResults hbs file to display and build from the newly created file with the stringified data.
        res.render('searchResults');
    }).catch(function(err){
        res.json(err);
    });
    }
});
//whenever someone hits the logout page this will delete the session. This makes it so the user has to go back to the index route and login in again. This isnt a essential component but adds a small layer of coolness to the project :D
router.get('/logout', middleware.requiresLogin, (req, res, next) =>{
    req.session.destroy((err) =>{
        if(err){
            res.send(err);
        }else{
            res.redirect('/');
        }
    });
});
//basically our failsafe that we send when the middleware catches something. A simple generic error page that does not address the current the issue just all possibilities considered. 
router.get('/error', (req, res) =>{
    res.render('error');
});

module.exports = router;