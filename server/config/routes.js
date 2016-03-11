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

var jwt = require('jsonwebtoken');
var secret = 'shhh! it\'s a secret';


Promise.promisifyAll(utils);

module.exports = (app, express) => {
	app.route('/')
		.get((req, res) =>{
			res.redirect('/app/auth/signin.html');
		})
	app.route('/signin')
		.post((req,res) => {
			let username = req.body.username;
			let password = req.body.password;
			res.send('hi');
		});

	app.route('/signup')
		.post((req, res) => {
			let username = req.body.username;
			let password = req.body.password;
			res.send('hi');
		})
	app.route('/api/success')
		.get((req,res) => {});

	app.route('/api/failure')
		.get((req, res) => {});

	app.get('auth/github', passport.authenticate('github'));

	app.get('auth/github/callback',
		passport.authenticate('github', {failureRedirect:'/api/failure'}),
		(req, res) => {
			let username = req.user.profile.username

		})
}