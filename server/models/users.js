'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');
let _ = require('lodash');
let bcrypt = Promise.promisifyAll(require('bcrypt'));
let Snippets = Promise.PromisifyAll(require('./snippets.js'));

let userSchema = mongoose.Schema({
  _password: {type: String},
  _createdAt: {type: Date, default: new Date()},
  _updatedAt: {type: Date, default: new Date()},
  login: { type: String},
  id: { type: Number},
  avatar_url: { type: String },
  gravatar_id: { type: String },
  url: { type: String},
  html_url: { type: String },
  followers_url: { type: Number },
  following_url: { type: Number },
  gists_url: { type: String },
  starred_url: { type: String },
  subscriptions_url: { type: String },
  organizations_url: { type: String },
  repos_url: { type: String },
  events_url: { type: String },
  received_events_url: { type: String },
  type: { type: String },
  site_admin: { type: Boolean },
  name: { type: String },
  company: { type: String },
  blog: { type: String },
  location: { type: String },
  email: { type: String, required: true, unique: true, dropDups: true},
  hireable: { type: Boolean },
  bio: { type: String },
  public_repos: { type: Number },
  public_gists: { type: Number },
  followers: { type: String },
  following: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  total_private_repos: { type: Number },
  owned_private_repos: { type: Number },
  private_gists: { type: Number },
  disk_usage: { type: Number },
  collaborators: { type: String },
  plan:{
    name: { type: String },
    space: { type: String },
    private_repos: { type: Number },
    collaborators: { type: Number },
  },
  snippets: { type: mongoose.Schema.Types.Mixed },
});

let User = mongoose.model('User',userSchema);

User.makeUser = (userObj, callback) => {
  let pw = userObj._password;
  
  // email based login
  if (typeof pw === 'string' && pw !== ''){
    return bcrypt.genSaltAsync(13)
      .then((salt) => {
        return bcrypt.hashAsync(userObj._password, salt);
      })
      .then((hash) => {
        userObj._password = hash;
        return Snippets.makeRootFolderAsync(userObj.email);
      })
      .then((rootFolder) => {
        userObj.snippets = rootFolder;
        return User.create(userObj);
      })
      .then((result) => {
        return callback(result);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  // OAuth based login (no supplied password)
  if (typeof userObj.id === 'number') {
    return User.create(userObj)
      .then((result) => {
        callback(result);
        return
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }

  console.log("you must supply a password or github id to retrieve user data");
}

User.getUser = (email) => {
  return User.findOne({email: email})
    .then((userObj) => {
      userObj = userObj.toObject();
      callback(userObj);
    })
    .catch((err) => {
      console.log("error", err);
    });
}

User.checkCredentials = (email, attempt, callback) => {
  // TODO password verification
  let userData = {};
  return User.findOne({email: email})
    .then((foundUser) => {
      if (foundUser){
        userData = foundUser.toObject();
        return bcrypt.compareAsync(attempt,foundUser._password);
      }
      return new Error("Email not found");
    })
    .then((success) => {
      if (success){
        delete userData._password;
        return callback(userData);
      }
      return new Error("Incorrect Password");
    })
    .catch((err) => {
      console.log("error", err);
    });
}

User.updateUser = (email, newProps, callback) => {
 newProps._updatedAt = new Date();
 return User.update({email: email}, newProps, { multi: false } , (err, raw) => {
      if (raw) {
          callback(null, raw);
      } else {
        callback(err, null);
      }
    });
}

User.removeUser = (email, callback) => {
  User.findOne({email: email}).remove(callback);
}

module.exports = User;
