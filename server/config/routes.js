"use strict";
var _ = require('lodash');
var passport = require('passport');
var Promise = require('bluebird');

var utils = require('./utils');
var config = require('../config');
var Users = Promise.promisifyAll(require('../models/users'));
var Snippets = Promise.promisifyAll(require('../models/snippets'));

var redis = require('redis');
var redisClient = redis.createClient();

var jwt = require('jsonwebtoken');
var secret = 'shhh! it\'s a secret';


Promise.promisifyAll(utils);

let checkReqAuthorization = (req, res, next) => {
	let token = req.headers['x-access-token'];
	redisClient.get(token, (err, result) => {
		if(err || result === undefined) {
			res.status(401).send('Unauthorized');
		} else {
			next();
		}
	});
}

let addReqTokenToRedisAsync = (token) => {
	return new Promise((resolve, reject) => {
		redisClient.mset([token, true], (err, replies) => {
			err ? reject(err) : resolve(replies);
		});
	});
}

let removeReqTokenFromRedisAsync = (token) => {
	return new Promise((resolve, reject) => {
		redisclient.del(token, (err, replies) => {
			err ? reject(err) : resolve(replies);
		});
	});
}

module.exports = (app, express) => {

	app.route('/signin')
		.post((req,res) => {
			let {email, password} = req.body;
			let token;
			  //Do some comparing
			Users.checkCredentialsAync(email, password) 
			.then((userData) => {
				token = jwt.sign(email, secret);
				addReqTokenToRedisAsync(token)
				.then((replies) => {
					//should we send user data on success?
					console.log(token);
					res.status(201).send(token);
				})
				.catch((err) => {
					console.log(err);
					res.status(500).send(err);
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(401).send('Unauthorized');
			});
		});

	app.route('/signup')
		.post((req, res) => {
			let {email, password} = req.body;
			let token;
			////Do some saving
			Users.makeUserAsync({
				email:email, 
				_password: password
			})
			.then((userData) => {
				token = jwt.sign(email, secret);
				return addReqTokenToRedisAsync(token)
			})
			.then((reddisReplies) => {
				// can also send userData
				return res.status(201).send(token)
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).send(err);
			});
		});

	app.route('/logout')
		.get((req, res) => {
			let token = req.header['x-access-token'];
			removeReqTokenFromRedisAsync(token)
			.then((replies) => {
				res.status(200).send(token);
			})
			.catch((err) => {
				res.send(500).send(err);
			});

		});

	app.route('/api/snippets')
		.get((req, res) => {
			console.log(req.param("_id"), typeof req.param("_id"));
			Snippets.getSnippetAsync(req.param("_id"))
				.then((snippet) => {
					if (snippet) {
						res.status(200).send(snippet)
					} else {
						res.status(404).send("Snippet not Found");
					}
				})
				.catch((err) => {
					res.send(500).send(err);
				})
		})

		.post((req, res) => {
			Snippets.makeSnippetAsync(req.body)
				.then((snippet) => {
					res.status(201).send(snippet)
				})
				.catch((err) => {
					res.send(500).send(err);
			})
		})

		.delete((req,res) => {
			Snippets.removeSnippetAsync(req.body.snippetId)
				.then((snippet) => {
					if (snippet) {
						res.status(201).send(snippet);
					} else {
						res.status(404).send("Snippet not Found");
					}
				})
				.catch((err) => {
					res.send(500).send(err);
				})
		})
		.put((req,res) => {
			Snippets.updateSnippetAsync(req.body.snippetId, req.body.value)
				.then((snippet) => {
					if (snippet) {
						res.status(201).send(snippet);
					} else {
						res.status(404).send("Snippet not Found");
					}
				})
				.catch((err) => {
					res.send(500).send(err);
				})
		});

	app.route('/api/user/snippets/')
		.get((req, res) => {
			var email = jwt.verify(req.headers.token, secret);
			var filepath = req.path;
			return Snippets.getSnippetByFilepathAsync(email, filepath)
				.then((results) => {
			  		if (Array.isArray(results) && results.length > 0) {
						res.status(200).send(results);
					} else {
						res.status(404).send("Snippets not Found");
					}
			  	})
			  	.catch((err) => {
			  		res.send(500).send(err);
			  	})
		});

	app.route('/auth/github/failure')
		.get((req, res) => {
			res.status(401).send('Unauthorized');
		});

	app.get('/auth/github', passport.authenticate('github'));

	app.get('/auth/github/callback',
		passport.authenticate('github', {failureRedirect:'/auth/github/failure'}),(req, res) => {
			let token = jwt.sign({username: req.user.profile.username}, secret);
			addReqTokenToRedisAsync(token)
			.then((replies) => {
				res.status(201).send(token)
			})
			.catch((err) => {
				console.log(err);
				res.status(500).send('Error');
			});
		});
}
