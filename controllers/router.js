const express = require('express');
const router = express.Router();
const database = require('../Models/index');
let usernameLog;

const middleware = {
    requiresLogin: function requiresLogin(req, res, next){
        if(req.session && req.session.userId){
            console.log('Middleware doing its stuff :D');
            return next();
        }else{
            let err = new Error('You must be logged in to view this page.');
            err.status = 401;
            res.redirect('/error');
            return next(err);
        }
    }
}


router.get('/', (req, res, next) =>{
    if(req.session.userId){
        res.render('home');
        // res.cookie('username', req.session.usernameLogged, {expires: new Date(Date.now() + 900000), httpOnly: true});
    }else{
    res.render('login');
    }
});

router.post('/', (req, res, next) =>{
        console.log(req.body);
    if(req.body.password !== req.body.confirmPassword){
        let err = new Error('Passwords do not match!');
        err.status = 400; 
        res.redirect('/error');
    }
    
    if(req.body.username && req.body.password){
         
             let userData = {
                username: req.body.username, 
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
             }
 
             database.User.create(userData, (err, user) => {
                 if(err){
                     return next(err);
                 }else{
                     usernameLog = req.body.username;
                     console.log()
                     req.session.userId = user._id;
                     req.session.usernameLogged = user.username;
                     console.log(user);
                     return res.redirect('/home');
                 }
             });
    }else if(req.body.logusername && req.body.logpassword){
        database.User.authenticate(req.body.logusername, req.body.logpassword, (error, user)=>{
            if(error || !user){
                console.log(error);
                res.redirect('/error');
            }else{
                req.session.userId = user._id;
                req.session.usernameLogged = user.username;
                console.log(user);
                return res.redirect('/home');
            }
        });
    }else{
        let err = new Error('All Fields Required');
        err.status = 400;
        return console.log(err); 
    }
});

router.get('/home', middleware.requiresLogin, function(req, res){
        return res.render('home');
        
});

router.get('/getUser', middleware.requiresLogin, function(req, res){
    res.json(req.session.usernameLogged);
});

router.get('/getArticles', function(req, res){
    database.Articles.find({}).then(function(dbArticles){
        res.json(dbArticles);
        console.log('articles found!');
    }).catch(function(err){
        res.json(err);
    });
});

router.get("/getArticles/:id", function(req, res){
    database.Articles.findOne({"_id": req.params.id}).populate("savedArticles").exec(function (err, doc){
        if(err){
            console.log(err);
        }else{
            res.json(doc);
        }    
    });
});

const SavedArticles = database.SavedArticles;
router.post('/getArticles/:id', function(req, res){
    let newArticle = new SavedArticles(req.body)
    console.log(req.params);

    SavedArticles.create(newArticle, (err, savedArticle) =>{
        if(err){
            console.log(err);
        }else{
            console.log(savedArticle);
        }
    });
});

router.get('/savedArticles', middleware.requiresLogin, (req, res, next) =>{
    database.SavedArticles.find({}).then((savedArticles) =>{
        res.json(savedArticles);
    }).catch((err) =>{
        console.log(err);
    })
});


router.get('/logout', middleware.requiresLogin, function(req, res, next){
    req.session.destroy(function(err){
        if(err){
            next(err);
        }else{
            return res.redirect('/');
        }
    });
});

router.get('/error', function(req, res){
    res.render('error');
});

module.exports = router;