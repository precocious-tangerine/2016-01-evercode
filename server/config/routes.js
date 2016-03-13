"use strict";
var _ = require('lodash');
var passport = require('passport');
var Promise = require('bluebird');

var utils = require('./utils');
var config = require('../config');
var Users = require('../models/users');
var Snippets = require('../models/snippets');

var redis = require('redis');
var redisClient = redis.createClient();

var jwt = require('jsonwebtoken');
var secret = 'shhh! it\'s a secret';


Promise.promisifyAll(utils);

let checkReqAuthorization = (req, res, next) => {
	let token = req.header['x-access-token'];
	redisClient.get(token, (err, result) => {
		if(err || result === undefined) {
			res.status(401).send('Unauthorized');
		} else {
			next();
		}
	});
}

let addReqTokenToRedis = (token) => {
	return new Promise((resolve, reject) => {
		redisClient.mset([token, true], (err, replies) => {
			err ? reject(err) : resolve(replies);
		});
	});
}

let removeReqTokenFromRedis = (token) => {
	return new Promise((resolve, reject) => {
		redisclient.del(token, (err, replies) => {
			err ? reject(err) : resolve(replies);
		});
	});
}

module.exports = (app, express) => {

	app.route('/signin')
		.post((req,res) => {
			console.log(req.body);
			let {email, password} = req.body;
			  //Do some comparing
			Users.checkCredentials(email, password, (userData) => {
				if(userData) {
					let token = jwt.sign({email}, secret);
					addReqTokenToRedis(token)
					.then((replies) => {
						//should we send user data on success?
						res.status(201).send(token);
					})
					.catch((err) => {
						console.log(err);
						res.status(500).send(err);
					});
				} else {
					res.status(401).send('Unauthorized');
				}
			})
		});

	app.route('/signup')
		.post((req, res) => {
			let {email, password} = req.body;
			////Do some saving
			Users.makeUser({
				email:email, 
				_password: password
			}, (userData) => {
				let token = jwt.sign({email}, secret);
				addReqTokenToRedis(token)
				.then((replies) => {
					// can also send userData
					res.status(201).send(token);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).send(err);
				})
			});
		});

	app.route('/logout')
		.get((req, res) => {
			let token = req.header['x-access-token'];
			removeReqTokenFromRedis(token)
			.then((replies) => {
				res.status(200).send(token);
			})
			.catch((err) => {
				res.send(500).send(err);
			})

		})

	app.route('/api/snippets')
		.get((req, res) => {

		})
		.post((req, res) => {

		})
		.delete((req,res) => {

		})
		.update((req,res) => {

		})

	app.route('/auth/github/failure')
		.get((req, res) => {
			res.status(401).send('Unauthorized');
		});

	app.get('/auth/github', passport.authenticate('github'));

	app.get('/auth/github/callback',
		passport.authenticate('github', {failureRedirect:'/auth/github/failure'}),(req, res) => {
			let token = jwt.sign({username: req.user.profile.username}, secret);
			addReqTokenToRedis(token)
			.then((replies) => {
				res.status(201).send(token)
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send('Error');
			});
		});
}
