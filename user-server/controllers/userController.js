'use strict';
let Promise = require('bluebird');
let request = require('request');
let qs = require('querystring');
let setup = require('../../setup');
let Users = require('../models/users');
let utils = require('../config/utils.js');
let bcrypt = Promise.promisifyAll(require('bcrypt'));


//Email verification configuration
let mongoose = require('mongoose');
mongoose.connect(setup.mongodbHost + setup.mongodbPort + setup.mongodbUsersName);
let nev = Promise.promisifyAll(require('email-verification')(mongoose));
nev.configureAsync({
  persistentUserModel: Users,
  expirationTime: 600,
  verificationURL: setup.server + '/user/email-verification/${URL}',
  transportOptions: {
    service: 'Gmail',
    auth: {
      user: setup.email,
      pass: setup.emailPassword
    }
  },
  passwordFieldName: '_password',
});

nev.generateTempUserModelAsync(Users)
  .then(tempUser => console.log('created tempUser', tempUser))
  .catch(err => console.log('err in tempUser', err));



module.exports = {
  signin(req, res) {
    let { email, password } = req.body;
    let token;
    //Do some comparing
    Users.checkCredentialsAsync(email, password)
    .then((userData) => {
      token = utils.createJWT({ email, username: userData.username });
      res.status(201).send({ token, msg: 'Authorized' });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send({ msg: 'Unauthorized' });
    });
  },
  postSignup(req, res) {
    let {email, password, username} = req.body;
    bcrypt.genSaltAsync(13)
    .then(salt => bcrypt.hashAsync(password, salt))
    .then(hash => {
      let newUser = new Users({username, email, _password: hash});
      return nev.createTempUserAsync(newUser);
    })
    .then((newTempUser) => {
      if (newTempUser) {
        let URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmailAsync(email, URL)
        .then((info) => {
          res.send('an email has been sent to you. Please verify it\n, info: ' + JSON.stringify(info));
        })
        .catch(err => {
          res.status(404).send(err);
        });
      } else {
        res.send('You have already signed up');
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
  },
  getVerification(req, res) {
    let url = req.params.URL;
    nev.confirmTempUserAsync(url)
    .then((user) => {
      if (user) {
        utils.createRootFolderAsync(user)
        .then(() => nev.sendConfirmationEmailAsync(user.email))
        .then(() => res.redirect('http://neverco.de/#/main/public?verified=true'))
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
  },
  userInfo(req, res) {
    let email = req.user.email;
    Users.getUserAsync(email)
    .then(userData => {
      let { username, avatar_url, email, theme, selectedSnippet, language, sublimeSecret } = userData;
      let user = { username, avatar_url, email, theme, selectedSnippet, language, sublimeSecret };
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  },
  updateUserInfo(req, res) {
    let email = req.user.email;
    Users.updateUserAsync(email, req.body)
    .then(() => {
      Users.getUserAsync(email)
      .then(userData => {
        let { username, avatar_url, email, theme, selectedSnippet, language } = userData;
        let user = { username, avatar_url, email, theme, selectedSnippet, language };
        res.status(201).send(user);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
  },
  updatePassword(req, res) {
    let { email, password, newPassword } = req.body;
    if (typeof newPassword === 'string' && newPassword !== '') {
      Users.findOne({ email: email })
      .then(foundUser => {
        if (foundUser) {
          return bcrypt.compareAsync(password, foundUser._password)
            .then(() => bcrypt.genSaltAsync(13))
            .then(salt => bcrypt.hashAsync(newPassword, salt))
            .then(hash => {
              return Users.updateUserAsync(email, { _password: hash })
                .then(success => {
                  res.status(201).send(success);
                });
            })
            .catch(err => {
              res.status(500).send(err);
            });
        } else {
          res.status(500).send('User with given email does not exist');
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
    } else {
      res.status(500).send('New password has invalid format');
    }
  },
  generateSublimeSecret(req, res) {
    let email = req.user.email;
    Users.createSublimeSecretAsync(email)
    .then(secret => {
      res.status(201).send(secret);
    })
    .catch(() => res.status(401).send('Unauthorized'));
  },
  verifySublimeSecret(req, res) {
    let secret = req.headers.secret;
    Users.exchangeSecretForTokenAsync(secret)
    .then(userObj => {
      let { email, username } = userObj;
      let token = utils.createJWT({ email, username });
      res.status(200).send(token);
    })
    .catch(() => res.status(401).send('Unauthorized'));
  },
  githubLogin(req, res) {
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: setup.githubSecret,
      redirect_uri: req.body.redirectUri
    };
    let token;
    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, (err, response, accessToken) => {
      accessToken = qs.parse(accessToken);
      var headers = { 'User-Agent': 'Satellizer' };
      // Step 2. Retrieve profile information about the current user.
      request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, (err, response, profile) => {
        // Step 3a. Link user accounts.
        Users.findOne({ email: profile.email }, (err, existingUser) => {
          if (existingUser) {
            Users.updateUserAsync(profile.email, { github: profile.id, avatar_url: profile.avatar_url })
            .then(() => {
              var token = utils.createJWT({ email: existingUser.email, username: profile.name });
              res.status(201).send({ token });
            });
          } else {
            let { email, id, avatar_url, name } = profile;
            Users.makeUserAsync({ email, github: id, avatar_url, username: name })
            .then((userObj) => {
              token = utils.createJWT({ email: userObj.email, username: userObj.username });
              res.status(201).send({ token });
            })
            .catch((err) => {
              console.log(err);
              res.status(401).send('Unauthorized');
            });
          }
        });
      });
    });
  }
};







