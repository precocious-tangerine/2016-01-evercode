"use strict";
var request = require('request');
var _ = require('lodash');
var passport = require('passport');
var Promise = require('bluebird');

var utils = require('./utils');
var config = require('../config');

var Users = require('../models/users');
var Snippets = require('../models/snippets');

var Users = new Users();
var Snippets = new Snippets();

Promise.promisifyAll(utils);

module.exports = (app, express) => {

 }