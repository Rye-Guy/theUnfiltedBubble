const express = require('express');
const router = express.Router();
const User = require('../Models/User');

router.get('/', (req, res) =>{
    res.render('login')
});

router.post('/', (req, res) =>{
    console.log(req.body);
    //when password does not match when registering
    if(req.body.password !== req.body.confirmPassword){
        let err = new Error('Passwords are not the same');
        err.status = 400;
        res.send('Passwords are not the same');
        return err; 
    }
    //if all is good after that then take that sweet data and toss it to Mongo
    if(req.body.username && req.body.password){
        
        let userData = {
            username: req.body.username,
            password: req.body.password
        }
        //create the user in the database and apply 
        User.create(userData, (err, user) =>{
            if(err){
                console.log(err);
            }else{
                console.log(user);
                req.session.userId = user._id;
                return res.redirect('index');
            }
        })
    }else{
        let err = new Error('All Fields Required');
        err.status = 400;
        return console.log(err); 
    }
});

router.get('/home', function(req, res){
    User.findById(req.session.userId)
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