'use strict';
const Promise = require('bluebird');
var db = require('../db/database');
var _ = require('lodash');

var Users = function() {
 this._users = {};
};


Users.prototype.newUserAsync = function (user) {
  
}

Users.prototype.getUserAsync = function (userName) {
  
}

Users.prototype.updateUserAsync = function (user) {
 
}

Users.prototype.getUsersAsync = function(userName) {
  
}


module.exports = Users;
