const express = require('express');
const router = express.Router();
const database = require('../Models/index');


router.get('/', (req, res, next) =>{
    res.render('login')
    console.log(req.body);
});

router.post('/', (req, res, next) =>{
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

router.get('/home', function(req, res){
    database.User.findById(req.session.userId)
    .exec((err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(user === null){
                let err = new Error('Not authorized to view this page!');
                err.status = 400;
                return console.log(err);
            }
            else{
                console.log(user);
                return res.render('home');
            }
        }
    });
});



module.exports = router;