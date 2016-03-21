'use strict';
var Promise = require('bluebird');
var config = require('../config');
var mongoose = require('mongoose');
let bcrypt = Promise.promisifyAll(require('bcrypt'));
let nev = Promise.promisifyAll(require('email-verification')(mongoose));
let User = require('../models/users.js');

console.log('testing email verification setup');


let myHashingFunction = (password, tempUserData, inserTempUser, callback) => {
  bcrypt.genSaltAsync(13)
  .then((salt) => bcrypt.hashAsync(password, salt))
  .then((hash) => {
    return insertTempUser(hash, tempUserData, callback);
  });
}

console.log(typeof nev.configureAsync);
nev.configureAsync({
  persistentUserModel: User,
  expirationTime: 600,
  verificationURL: 'http://localhost:3000/email-verification/${URL}',
  transportOptions: { 
      service: 'Gmail',
      auth: {
        user: 'precocioustangerine2@gmail.com',
        pass: 'donkeydonkey'
      } 
  },
  hashingFunction: myHashingFunction,
  passwordFieldName: '_password',
})

nev.generateTempUserModel(User, (err, tempUser) => {
  if(err) {
    console.log('err in tempUser', err);
  } else {
    console.log('created tempUser', tempUser);
  }
});

//.then((options) => {
//  console.log('configured: ', options)
//  return nev.generateTempUserModelAsync(User);
//}).then((tempUserModel) => console.log('generated temp user', tempUserModel))
//.catch(err => {
//  console.log('err in config is', err);
//});

console.log('finished verification');

module.exports.postSignup = (req, res) => {
   let { email, password } = req.body;
   let newUser = new User({email, _password: password});
   nev.createTempUserAsync(newUser)
   .then((newTempUser) => {
     console.log('inside first then block');
      if(newTempUser) {
        console.log('newTempUser is', newTempUser);
        newTempUser.save();
        let URL = newTempUser[nev.options.URLFieldName];
        return nev.sendVerificationEmailAsync(email, URL)
         .then((info) => {
          res.send('an email has been sent to you. Please verify it\n, info:', info);
         }).catch(err => {
           console.log('err is ', err);
           res.status(404).send('failed to send');
         });
      } else {
        res.send('You have already signed up');
      }
   })
   .catch(res.status(500).send);
}


module.exports.getVerification = (req, res) => {
  let url = req.params.URL;
  nev.confirmTempUserAsync(url)
  .then((user) => {
    if(user) {
      nev.sendVerificationEmailAsync(user.email)
      .then((info) => {
        res.send('You have been confirmed');
        res.send(info);
      })
      .catch(err => res.status(404).send(err));
    } else {
      res.status(404).send('Error: confirming temp user FAILED');
    }
  })
  .catch(err => res.status(404).send('failed'));
}
