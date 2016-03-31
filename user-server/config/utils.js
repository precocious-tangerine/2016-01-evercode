'use strict';
let Promise = require('bluebird');
let request = require('request');
let setup = require('../../setup.js');
let mongoose = require('mongoose');
let bcrypt = Promise.promisifyAll(require('bcrypt'));
let nev = Promise.promisifyAll(require('email-verification')(mongoose));
let User = require('../models/users.js');
let jwt = require('jsonwebtoken');
let secret = setup.secretToken;


let createJWT = (user) => {
  let payload = {
    username: user.username,
    email: user.email
  };
  return jwt.sign(payload, secret);
};
module.exports.createJWT = createJWT;

module.exports.decode = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send('Please login');
  }
  try {
    req.user = jwt.decode(token, secret);
    next();
  } catch (error) {
    return next(error);
  }
}; 

//Declare here first for use locally
let createRootFolderAsync = (userObj) => {
  let token = createJWT(userObj);
  return new Promise((resolve, reject) => {
    let fullUrl = setup.filesServerAddress + ':' + setup.filesServerPort + '/files/api/folders';
    request({
      url: fullUrl,
      method: 'POST',
      headers: {
        'authorization': token
      },
      json: {
        path: userObj.email
      } 
    }, function(error, resp) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(resp);
      }
    });
  });
};
module.exports.createRootFolderAsync = createRootFolderAsync;


//Email verification configuration
nev.configureAsync({
  persistentUserModel: User,
  expirationTime: 600,
  verificationURL: 'http://localhost:3003/user/email-verification/${URL}',
  transportOptions: {
    service: 'Gmail',
    auth: {
      user: 'precocioustangerine2@gmail.com',
      pass: 'donkeydonkey'
    }
  },
  passwordFieldName: '_password',
});

nev.generateTempUserModelAsync(User)
  .then(tempUser => console.log('created tempUser', tempUser))
  .catch(err => console.log('err in tempUser', err));

module.exports.postSignup = (req, res) => {
  let {email, password, username} = req.body;
  bcrypt.genSaltAsync(13)
    .then(salt => bcrypt.hashAsync(password, salt))
    .then(hash => {
      let newUser = new User({username,email, _password: hash});
      return nev.createTempUserAsync(newUser);
    })
    .then((newTempUser) => {
      if (newTempUser) {
        let URL = newTempUser[nev.options.URLFieldName];
        return nev.sendVerificationEmailAsync(email, URL)
          .then((info) => {
            res.send('an email has been sent to you. Please verify it\n, info: ' + JSON.stringify(info));
          }).catch(err => {
            res.status(404).send(err);
          });
      } else {
        res.send('You have already signed up');
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
};


module.exports.getVerification = (req, res) => {
  let url = req.params.URL;
  nev.confirmTempUserAsync(url)
    .then((user) => {
      if (user) {
        createRootFolderAsync(user)
          .then(() => nev.sendConfirmationEmailAsync(user.email))
          .then(() => res.redirect('http://nevercode.com/#/main/public?verified=true'))
          .catch(err => {
            console.log('err: sending verify email', err);
            res.status(404).send(err);
          });
      } else {
        res.status(404).send('Error: confirming temp user FAILED');
      }
    })
    .catch(err => {
      console.log('err is', err);
      res.status(404).send('failed');
    });
};


