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
			res.redirect('/app/auth/signinCopy.html');
		});

	app.route('/signin')
		.post((req,res) => {
			let {username, password} = req.body;
			//Do some comparing
			
			let loginSucess = true;
			if(loginSucess) {
				let token = jwt.sign({username}, secret);
				res.send(201, token)
			} else {
				res.send(401, 'Unauthorized');
			}
		});

	app.route('/signup')
		.post((req, res) => {
			let {username, password} = req.body;
			////Do some saving

			let token = jwt.sign({username}, secret);
			res.send(201, token);
		});

	app.route('/auth/github/failure')
		.get((req, res) => {
			res.send(401, 'Unauthorized User');
		});

	app.get('auth/github', passport.authenticate('github'));

	app.get('auth/github/callback',
		passport.authenticate('github', {failureRedirect:'/api/failure'}),
		(req, res) => {
			let token = jwt.sign({username: req.user.profile.username}, secret);
			res.send(201, token);
		});
}