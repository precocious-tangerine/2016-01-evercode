'use strict';
var Promise = require('bluebird');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var config = require('../config');
var Users = Promise.promisifyAll(require('../models/users'));
var passport = require('passport');


module.exports = (app, express) => {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use(session({
    store: (new RedisStore({
      port: config.redisPort,
      host: config.redisHost
    })),
    secret: 'ssshhhhhhh',
    saveUninitialized: false,
    resave: false
  }));

  passport.use('github', new GitHubStrategy({
    clientID: config.githubClientId,
    clientSecret: config.githubSecret,
    callbackURL: config.serverUrl + '/auth/github/callback',
  }, (accessToken, refreshToken, profile, done) => {
    Users.findOne({ github: profile.id }, (err, existingUser) => {
      if(existingUser) {
        done(null, existingUser);
      } else {
        profile = JSON.parse(profile._raw);
        Object.keys(profile).forEach(function(key) {
          console.log('Key: ', key, ' value: ', profile[key], ' type: ', typeof profile[key])
        });
        Users.makeUserAsync(profile)
        .then((userObj) => done(null, userObj))
        .catch(done);
      }
    });
  }));

  passport.use('signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },(email, password, done) => {
    Users.checkCredentialsAsync(email, password)
      .then((userData) => {
        done(null, userData);
      }).catch((err) => {
        console.log(err);
        done(err);
      });
  }))

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    Users.makeUserAsync({ email, _password: password })
      .then((userData) => {
        done(null, userData);
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });

  }))
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/', express.static(__dirname + '/../../client'));
};
