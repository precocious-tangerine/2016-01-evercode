'use strict';
let Promise = require('bluebird');
let mongoose = require('mongoose');
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

let User = mongoose.model('User', userSchema);

User.makeUser = (userObj, callback) => {
  let pw = userObj._password;
  if (typeof pw === 'string' && pw !== '') {
    bcrypt.genSaltAsync(13)
    .then((salt) => bcrypt.hashAsync(pw, salt))
    .then((hash) => {
      userObj._password = hash;
      return utils.createRootFolderAsync(userObj);
    })
    .then(() => User.create(userObj))
    .then(result => {
      callback(null, result);
    })
    .catch(err => callback(err, null));
  } else if (userObj.github) {
    // OAuth based login (no supplied password)
    return utils.createRootFolderAsync(userObj)
      .then(() => User.create(userObj))
      .then(() => callback(null, userObj))
      .catch(err => callback(err, null));
  } else {
    callback(new Error('must login via github or local session'), null);
  }
};
User.getUser = (email, callback) => {
  return User.findOne({ email: email })
  .then((userObj) => {
    callback(null, userObj);
  })
  .catch(callback);
};
User.updateUser = (email, newProps, callback) => {
  newProps._updatedAt = new Date();
  User.update({ email }, newProps, { multi: false }, callback);
};
User.updateUserAsync = Promise.promisify(User.updateUser);
User.removeUser = (email, callback) => {
  User.findOne({ email }).remove(callback);
};
User.checkCredentials = (email, attempt, callback) => {
  let userData = {};
  return User.findOne({ email })
    .then(foundUser => {
      if (foundUser) {
        userData = foundUser.toObject();
        return bcrypt.compareAsync(attempt, foundUser._password)
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
};
User.createSublimeSecret = (email) => {
  return User.findOne({ email })
    .then(foundUser => {
      if (foundUser) {
        var newseed = (Math.random() * 100).toString();
        return bcrypt.genSaltAsync(13)
          .then(salt => bcrypt.hashAsync(newseed, salt))
          .then(hash => {
            foundUser.sublimeSecret = hash;
            return User.updateUserAsync(foundUser.email, foundUser);
          })
          .then(() => {
            return foundUser.sublimeSecret;    
          });
      }
      else {
        return new Promise((_,reject) => reject('User not found'));
      }
    });
};
User.exchangeSecretForToken = (sublimeSecret) => {
  console.log('about to query db for ', sublimeSecret);
  return User.findOne({ sublimeSecret });
};

module.exports = User;
