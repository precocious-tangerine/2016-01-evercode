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

var redis = require('redis');
var redisClient = redis.createClient();

Promise.promisifyAll(utils);

module.exports = (app, express) => {
	app.route('/')
		.get((req, res) =>{
			res.redirect('/index.html');
		})
	app.route('/api/signin')
		.post((req,res) => {
			console.log('posted to api/signin');
		});

	app.route('/api/success')
		.get((req,res) => {});

	app.route('/api/failure')
		.get((req, res) => {});
}