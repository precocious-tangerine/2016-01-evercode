"use strict";
var _ = require('lodash');
var passport = require('passport');
var Promise = require('bluebird');

var utils = require('./utils');
var config = require('../config');

var Users = require('../models/users');
var Files = require('../models/files');

var Users = new Users();
var Files = new Files();

Promise.promisifyAll(utils);

module.exports = (app, express) => {

}