'use strict';
var Promise = require('bluebird');
var config = require('../config');
var mongoose = require('mongoose');


var nev = Promise.promisifyAll(require('email-navigation')(mongoose));
var User = require('../models/users.js');
nev.configureAsync({
  persistentUserModel: User,
  expirationTime: 600,
  verificationURL: config.serverUrl + config.verificationEmailRoute,
  transportOptions: { 
      service: 'Gmail',
      auth: {
        user: 'test1',
        pass: 'test2'
      } 
  },
  hashingFunction: myHashingFunction
  passwordFieldName: 'password',
}).then((options) => {
  console.log('configured: ', options)
  return nev.generateTempUserModelAsync(User);
}).then((tempUserModel) => console.log('generated temp user', tempUserModel))
.catch(console.log);


let getSignup = (req, res) => {
   let { email, password } = req.body;
   let newUser = new User({email, _password: password});
   
}
