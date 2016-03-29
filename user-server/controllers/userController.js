'use strict';
let Promise = require('bluebird');
let request = require('request');
let qs = require('querystring');
let setup = require('../../setup');
let Users = Promise.promisifyAll(require('../models/users'));
let utils = require('../config/utils.js');

module.exports = {

  signin: ((req, res) => {
    let { email, password } = req.body;
    let token;
    //Do some comparing
    Users.checkCredentialsAsync(email, password)
      .then((userData) => {
        token = utils.createJWT({ email, username: userData.username });
        res.status(201).send({ token, msg: 'Authorized' });
      }).catch((err) => {
        console.log(err);
        res.status(401).send({ msg: 'Unauthorized' });
      });
  }),

  signup: ((req, res) => {
    let { email, password, username } = req.body;
    let token;
    Users.getUserAsync(email)
      .then(found => {
        if (found) {
          res.status(500).send('User with given email already exists!');
        } else {
          Users.makeUserAsync({ email, _password: password, username: username })
            .then(userData => {
              token = utils.createJWT({ email: userData.email, username: userData.username });
              res.status(201).send({ token });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        }
      });
  }),

  userInfo: ((req, res) => {
    let email = req.user.email;
    Users.getUserAsync(email)
      .then(userData => {
        let { username, avatar_url, email, theme, selectedSnippet, language } = userData;
        let user = { username, avatar_url, email, theme, selectedSnippet, language };
        res.status(201).send(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }),

  updateUserInfo: ((req, res) => {
    let email = req.user.email;
    Users.updateUserAsync(email, req.body)
      .then(success => {
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
  }),

  githubLogin: ((req, res) => {
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
            Users.updateUserAsync(profile.email, { github: profile.id, avatar_url: profile.avatar_url, username: profile.name }).then((success) => {
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
  })
};
