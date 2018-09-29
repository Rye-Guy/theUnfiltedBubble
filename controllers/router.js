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

//middleware ojbect used to store custom middleware functions. Only really used it to contain one but it can easily be modified now if I wanted to add more middleware. 
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

router.get('/home', middleware.requiresLogin, (req, res) =>{
        return res.render('home');
        
});

router.get('/savedArticles', middleware.requiresLogin, (req, res)=>{
    return res.render('savedArticles');
});

router.post('/userVotes/:id', middleware.requiresLogin, (req, res)=>{
    console.log(req.body);
    database.SavedArticles.findByIdAndUpdate({'_id': req.body._id},{'votes': parseInt(req.body.votes)}).exec((err, doc)=>{
        if(err){
            res.send(err);
        }else{
            res.send(doc);
        }
   });

});


router.get('/getSavedComments/:id', function(req, res){ 
    console.log(req.params);
    database.Comments.find({'articleId': req.params.id}).then(function (result){
        res.json(result);
    }).catch(function(err){
        console.log(err);
        res.json(err);
    });
    
});
Comment = database.Comments;
router.post('/savedArticles/:id', middleware.requiresLogin, (req, res)=>{
    let newComment = new Comment(req.body);
    newComment.save(function(err, doc){
        if(err){
            res.send(err);
        }else{
            database.SavedArticles.findOneAndUpdate({'_id': req.params.id}, {'comments': doc._id}).exec((err, doc)=>{
                if(err){
                    res.send(err);
                }else{
                    console.log(doc);
                    res.send(doc);
                }
            })
        }
    })
});

router.get('/getUser', middleware.requiresLogin, (req, res) =>{
    res.json(req.session.usernameLogged);
});

router.get('/getArticles', (req, res) =>{
    database.Articles.find({}).then((dbArticles) =>{
        res.json(dbArticles);
        console.log('articles found!');
    }).catch(function(err){
        res.json(err);
    });
});

router.get("/getArticles/:id", (req, res) =>{
    database.Articles.findOne({"_id": req.params.id}).populate("savedArticles").exec((err, doc) =>{
        if(err){
            res.send(err);
        }else{
            res.json(doc);
        }    
    });
});

const SavedArticles = database.SavedArticles;
router.post('/getArticles/:id', (req, res) =>{
    let newArticle = new SavedArticles(req.body);
    console.log(req.body);
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

router.get('/getSavedArticles', middleware.requiresLogin, (req, res, next) =>{
    database.SavedArticles.find({}).sort({'votes': -1}).then((savedArticles) =>{
        res.json(savedArticles);
    }).catch((err) =>{
        res.send(err);
    })
});

router.get('/search', middleware.requiresLogin, (req, res, next)=>{
    res.json(JSON.parse(localStorage.getItem('searchData'+req.session.usernameLogged)));
}); 

router.post('/search', middleware.requiresLogin, (req, res, next)=>{
    if(req.body.searchInput){
    database.Articles.find({$text: {$search: req.body.searchInput}}).then((result)=>{
        localStorage.setItem('searchData'+req.session.usernameLogged, JSON.stringify(result));
        let currentSearchResults = localStorage.getItem('searchData'+req.session.usernameLogged);
        console.log(currentSearchResults);
        res.render('searchResults');
    }).catch(function(err){
        res.json(err);
    });
    }
});


router.get('/logout', middleware.requiresLogin, (req, res, next) =>{
    req.session.destroy((err) =>{
        if(err){
            res.send(err);
        }else{
            res.redirect('/');
        }
    });
});

router.get('/error', (req, res) =>{
    res.render('error');
});

module.exports = router;