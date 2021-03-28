const express = require('express');
const router = express.Router();
const passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
var User = require('../models/User');
// var id = require('../config/credentials.json');
var bcrypt = require('bcryptjs');


const middlefun = (req,res,next)=>{
  // console.log(req.headers)
  if(req.query.applogin){
    // console.log(req.query.linkingUri)
    baseUri = req.query.linkingUri;
    // console.log(baseUri)
    req.session.redirectTo = baseUri
    // req.session.save()
    next()
  }else{
    req.session.redirectTo = '/dashboard?'
    next()
  }
}


router.get('/google',middlefun,passport.authenticate('google', { scope: ['email','profile'] }))
router.get('/google/callback',passport.authenticate('google',{ failureRedirect: '/'}),(req,res)=>{
  // console.log(req.session.redirectTo)
  res.redirect(`${req.session.redirectTo}success=true`)
});
router.get('/facebook',middlefun,passport.authenticate('facebook', {scope: ['email']}));
router.get('/facebook/callback',passport.authenticate('facebook',{ failureRedirect: '/'}),(req,res)=>{
  res.redirect(`${req.session.redirectTo}success=true`)
});
router.post('/local', (req, res, next)=>{
  passport.authenticate('local', (err, user, info)=> {
    if (err) { return next(err); }
    if (!user) { return res.json({
      msg:"User And Password Doesnt Match",
      status:false
    }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return  res.json({
        msg:"success",
        status:true
      });
    });
  })(req, res, next);
});



passport.serializeUser((user, done) => {
  // console.log(user)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // console.log(id)
  User.findById(id, (err, user) => done(err, user))
})

passport.use(new FacebookStrategy({
  clientID:process.env.FB_CLIENTID,
  clientSecret: process.env.FB_CLIENTSECRET,
  callbackURL: "http://localhost:8080/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
  // console.log(profile)
  User.findOne({'facebook.id': profile.id}, function(err, user){
    if(err)
      return done(err);
    if(user){

    return done(null, user);
    }
    else {
      var newUser = new User();
      newUser.facebook.id = profile.id;
      newUser.facebook.token = accessToken;
      newUser.facebook.name = profile.displayName;
      // newUser.facebook.email = profile.emails[0].value;

      newUser.save()
        .then((newUser)=>{
          return done(null, newUser);
        })
      // console.log(profile);
    }
}

)}
));


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile.id)
    User.findOne({'google.id': profile.id}, function(err, user){
      if(err) return done(err);
        if(user){
        return done(null, user);
        }
      else {
        // console.log(profile)
        var user = new User();
        user.google.id = profile.id;
        user.google.token = accessToken;
        // newUser.google.name = profile.name.givenName + ' ' + profile.name.familyName;
        user.google.email = profile.emails[0].value;

        user.save()
          .then((user)=>{
            return done(null, user);
          })
  
      }
  }
  
  )}
  ));


passport.use('local',
  new LocalStrategy(
    async (username,password,done) => {
      // console.log(username)
      try {
        let user = await User.findOne({ username: username })
      // console.log(user)
        if (!user) {
          return done(null, false)
        }

        bcrypt.compare(password, user.password).then((res) => {
          if(!res) return done(null, false);
         else return done(null, user);
        });

      } catch (err) {
        console.error(err)
      }
    }
  )
)


router.post('/SignUp',(req,res,next)=>{
  User.findOne({username:req.body.username})
      .exec()
      .then((user) => {
          // console.log(user)
          if(user){
              console.log('Already Exist Will Put In React after Better Forms')
              res.json({
                msg:"Username Exist"
              })  
          } 
          else{
              bcrypt.genSalt(10, (err, salt)=>{
                  bcrypt.hash(req.body.password, salt, (err, hash)=>{
                      // Store hash in your password DB.
                      var newuser = new User;
                      newuser.username = req.body.username;
                      newuser.password = hash;
                      newuser.save()
                          .then(() =>{res.json({msg:"Added"});console.log('Added')})
                          .catch((err) => next(err))
                  });
              });

          }
      })

      .catch((err) => next(err));
})



module.exports = router;
