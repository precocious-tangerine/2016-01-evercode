'use strict';
let Promise = require('bluebird');
let config = require('../config');
let mongoose = require('mongoose');
let bcrypt = Promise.promisifyAll(require('bcrypt'));
let nev = Promise.promisifyAll(require('email-verification')(mongoose));
let User = require('../models/users.js');
let Snippets = require('../models/snippets.js');
let jwt = require('jsonwebtoken');
let secret = require('../config').secretToken;


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
  passwordFieldName: '_password',
});

nev.generateTempUserModelAsync(User)
  .then(tempUser => console.log('created tempUser', tempUser))
  .catch(err => console.log('err in tempUser', err));



module.exports.postSignup = (req, res) => {
  let { email, password } = req.body;
  bcrypt.genSaltAsync(13)
    .then(salt => bcrypt.hashAsync(password, salt))
    .then(hash => {
      let newUser = new User({ email, _password: hash });
      return nev.createTempUserAsync(newUser);
    })
    .then((newTempUser) => {
      if (newTempUser) {
        let URL = newTempUser[nev.options.URLFieldName];
        return nev.sendVerificationEmailAsync(email, URL)
          .then((info) => {
            res.send('an email has been sent to you. Please verify it\n, info: ' + JSON.stringify(info));
          }).catch(err => {
            console.log('err is ', err);
            res.status(404).send('failed to send');
          });
      } else {
        res.send('You have already signed up');
      }
    })
    .catch(res.status(500).send);
};


module.exports.getVerification = (req, res) => {
  let url = req.params.URL;
  nev.confirmTempUserAsync(url)
    .then((user) => {
      if (user) {
        Snippets.makeRootFolderAsync(user.email)
          .then(() => nev.sendConfirmationEmailAsync(user.email))
          .then(() => res.send('You have been confirmed as a user'))
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

module.exports.createJWT = (user) => {
  let payload = {
    username: user.username,
    email: user.email
  };
  return jwt.sign(payload, secret);
};

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