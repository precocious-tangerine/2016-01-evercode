'use strict';
let mongoose = require('mongoose');
let setup = require('../../setup.js');
let db = mongoose.createConnection(setup.mongodbHost + setup.mongodbPort + setup.mongodbUsersName);

let Promise = require('bluebird');
let bcrypt = Promise.promisifyAll(require('bcrypt'));
let utils = require('../config/utils.js');

let userSchema = mongoose.Schema({
  _password: { type: String },
  _createdAt: { type: Date, default: new Date() },
  _updatedAt: { type: Date, default: new Date() },
  github: { type: Number },
  avatar_url: { type: String },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, dropDups: true },
  theme: { type: String, default: 'eclipse' },
  language: { type: String, default: 'javascript' },
  selectedSnippet: { type: String },
  sublimeSecret: { type: String, default: 'No secret issued;' }
});


let userStatics = {
  makeUser(userObj, callback) {
    let pw = userObj._password;
    if (typeof pw === 'string' && pw !== '') {
      bcrypt.genSaltAsync(13)
      .then((salt) => bcrypt.hashAsync(pw, salt))
      .then((hash) => {
        userObj._password = hash;
        return utils.createRootFolderAsync(userObj);
      })
      .then(() => this.create(userObj))
      .then(result => {
        callback(null, result);
      })
      .catch(err => callback(err, null));
    } else if (userObj.github) {
      // OAuth based login (no supplied password)
      utils.createRootFolderAsync(userObj)
      .then(() => this.create(userObj))
      .then(() => callback(null, userObj))
      .catch(err => callback(err, null));
    } else {
      callback(new Error('must login via github or local session'), null);
    }
  },
  getUser(email, callback) {
    this.findOne({ email })
    .then((userObj) => {
      callback(null, userObj);
    })
    .catch(callback);
  },
  updateUser(email, newProps, callback) {
    newProps._updatedAt = new Date();
    this.update({ email }, newProps, { multi: false }, callback);
  },
  removeUser(email, callback) {
    this.findOne({ email }).remove(callback);
  },
  checkCredentials(email, attempt, callback) {
    let userData = {};
    this.findOne({ email })
    .then(foundUser => {
      if (foundUser) {
        userData = foundUser.toObject();
        bcrypt.compareAsync(attempt, foundUser._password)
        .then(success => {
          if (success) {
            delete userData._password;
            callback(null, userData);
          } else {
            callback(new Error('Incorrect Password'), null);
          }
        })
        .catch(callback);
      } else {
        callback(new Error('Email not found'), null);
      }
    });
  },
  createSublimeSecretAsync(email) {
    return this.findOne({ email })
      .then(foundUser => {
        if (foundUser) {
          var newseed = (Math.random() * 100).toString();
          return bcrypt.genSaltAsync(13)
            .then(salt => bcrypt.hashAsync(newseed, salt))
            .then(hash => {
              foundUser.sublimeSecret = hash;
              return this.updateUserAsync(foundUser.email, foundUser);
            })
            .then(() => {
              return foundUser.sublimeSecret;    
            });
        }
        else {
          return new Promise((_,reject) => reject('User not found'));
        }
      });
  },
  exchangeSecretForTokenAsync(sublimeSecret) {
    return this.findOne({ sublimeSecret });
  }
};

let userStaticsAsync = Promise.promisifyAll(userStatics);
Object.assign(userSchema.statics, userStaticsAsync);
let User = db.model('User', userSchema);
module.exports = User;