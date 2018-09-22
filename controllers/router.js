const express = require('express');
const router = express.Router();
const database = require('../Models/index');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./clientStoredSearch');

const middleware = {
    requiresLogin: (req, res, next) =>{
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
                res.send(err);
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
    database.SavedArticles.findByIdAndUpdate({'_id': req.body._id},{'votes': req.body.votes}).exec((err, doc)=>{
        if(err){
            res.send(err);
        }else{
            res.send(doc);
        }
   });

});

// router.get('/userVotes', middleware.requiresLogin, (req, res)=>{
//     database.SavedArticles.findByIdAndUpdate({'_id': req.params.id},{'vote': parseInt(req.params.vote)}).exec((err, doc)=>{
//          if(err){
//              res.send(err);
//          }else{
//              res.send(doc);
//          }
// });
    
    // database.Votes.find({}).then(function (result){
    //     res.json(result);
    // }).catch(function(err){
    //     console.log(err);
    //     res.json(err);
    // });
// });





router.get('/getSavedComments/:id', function(req, res){ 
    console.log(req.params);
    database.Comments.find({'articleId': req.params.id}).then(function (result){
        res.json(result);
    }).catch(function(err){
        console.log(err);
        res.json(err);
    });
    
});



const Comment = database.Comments;

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
    let newArticle = new SavedArticles(req.body)
    console.log(req.params);

    SavedArticles.create(newArticle, (err, savedArticle) =>{
        if(err){
            res.send(err);
        }else{
            console.log(savedArticle);
        }
    });
});

router.get('/getSavedArticles', middleware.requiresLogin, (req, res, next) =>{
    database.SavedArticles.find({}).then((savedArticles) =>{
        res.json(savedArticles);
    }).catch((err) =>{
        res.send(err);
    })
});

router.get('/search', middleware.requiresLogin, (req, res, next)=>{
    res.json(JSON.parse(localStorage.getItem('searchData'+req.session.usernameLogged)));
}); 

router.post('/search', middleware.requiresLogin, (req, res, next)=>{
    // database.Articles.createIndex({ articleTitle: "text" });
    console.log(req.body);
    if(req.body.searchInput){
    database.Articles.find({$text: {$search: req.body.searchInput}}).then((result)=>{
        localStorage.setItem('searchData'+req.session.usernameLogged, JSON.stringify(result));
        let currentSearchResults = localStorage.getItem('searchData'+req.session.usernameLogged);
        console.log(currentSearchResults);
        res.render('searchResults');
        // localStorage.setItem('searchResultsOjb', result);
        // let currentSearchResults = localStorage.getItem('searchResultsOjb');
        // console.log(JSON.parse(currentSearchResults));
        // res.redirect('/');
    }).catch(function(err){
        res.json(err);
    });
    }
});


router.get('/logout', middleware.requiresLogin, (req, res, next) =>{
    req.session.destroy((err) =>{
        if(esrr){
            next(err);
        }else{
            return res.redirect('/');
        }
    });
});

router.get('/error', (req, res) =>{
    res.render('error');
});

module.exports = router;