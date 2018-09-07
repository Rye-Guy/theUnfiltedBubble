const express = require('express');
const router = express.Router();
const database = require('../Models/index');
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
    res.render('login')
});

router.post('/', (req, res, next) =>{
    
    if(req.body.password !== req.body.confirmPassword){
        let err = new Error('Passwords do not match!');
        err.status = 400; 
        res.redirect('/error');
    }else if(req.body.username && req.body.password){
         
             let userData = {
                username: req.body.username, 
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
             }
 
             database.User.create(userData, (err, user) => {
                 if(err){
                     return next(err);
                 }else{
                     req.session.userId = user._id;
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