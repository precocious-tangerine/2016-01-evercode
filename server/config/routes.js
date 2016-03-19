"use strict";
// var passport = require('passport');
var Promise = require('bluebird');
var request = require('request');
var qs = require('querystring');

var config = require('../config');
var Users = Promise.promisifyAll(require('../models/users'));
var Snippets = Promise.promisifyAll(require('../models/snippets'));

var redis = require('redis');
var redisClient;
if (process.env.REDIS_PORT_6379_TCP_PORT || process.env.REDIS_PORT_6379_TCP_ADDR) {
  redisClient = redis.createClient(
    process.env.REDIS_PORT_6379_TCP_PORT,
    process.env.REDIS_PORT_6379_TCP_ADDR
  );
} else {
  redisClient = redis.createClient()
}

var jwt = require('jsonwebtoken');
var secret = 'shhh! it\'s a secret';

let createJWT = (user) => {
  var payload = {
    sub: user._id,
    email: user.email
  };
  return jwt.sign(payload, secret);
}

let checkReqAuthorization = (req, res, next) => {
  let token = req.headers.authorization;
  redisClient.get(token, (err, result) => {
    if (err || result === undefined) {
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
    redisClient.del(token, (err, replies) => {
      err ? reject(err) : resolve(replies);
    });
  });
}

module.exports = (app, express) => {
  app.route('/signin')
    .post((req, res) => {
      let { email, password } = req.body;
      let token;
      //Do some comparing
      Users.checkCredentialsAsync(email, password)
        .then((userData) => {
          token = createJWT({ email });
          addReqTokenToRedisAsync(token)
            .then((replies) => {
              res.status(201).send(token);
            }).catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        }).catch((err) => {
          console.log(err);
          res.status(401).send('Unauthorized');
        });
    });

  app.route('/signup')
    .post((req, res) => {
      let { email, password } = req.body;
      let token;
      Users.makeUserAsync({ email, _password: password })
        .then((userData) => {
          token = createJWT({ email });
          return addReqTokenToRedisAsync(token)
        })
        .then(() => res.status(201).send(token))
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    });

  app.route('/signout')
    .get((req, res) => {
      let token = req.headers.authorization;
      removeReqTokenFromRedisAsync(token)
        .then(() => res.status(200).send(token))
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    });

  app.route('/api/snippets')
    .get((req, res) => {
      Snippets.getSnippetAsync(req.query["_id"])
        .then((snippet) => {
          if (snippet) {
            res.status(200).send(snippet)
          } else {
            res.status(404).send("Snippet not Found");
          }
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    })
    .post((req, res) => {
      let email = jwt.verify(req.headers.authorization, secret).email;
      req.body.createdBy = email;
      Snippets.makeSnippetAsync(req.body)
        .then((snippet) => {
          res.status(201).send(snippet)
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    })
    .delete((req, res) => {
      console.log('removeSnippetAsync: ', req.query, req.params);
      
      Snippets.removeSnippetAsync(req.query.snippetId)
        .then((response) => {
          if (response) {
            res.status(201).send(response);
          } else {
            res.status(404).send("Snippet not Found");
          }
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    })
    .put((req, res) => {
      Snippets.updateSnippetAsync(req.body.snippetId, req.body.value)
        .then((success) => {
          if (success) {
            Snippets.getSnippetAsync(req.body.snippetId).then((snippet) => {
              if (snippet) {
                res.status(201).send(snippet);
              } else {
                res.status(404).send("Snippet not Found");
              }
            })
          } else {
            res.status(404).send("Snippet not Found");
          }
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    });

  app.route('/api/user/snippets/')
    .get((req, res) => {
      let token = jwt.verify(req.headers.authorization, secret);
      return Snippets.getSnippetsByUserAsync(token.email)
        .then((results) => {
          if (Array.isArray(results) && results.length > 0) {
            var fileTreeObj = {};
            results.forEach((node) => {
              fileTreeObj[node.filePath] = node;
            });
            res.status(200).send(fileTreeObj);
          } else {
            res.status(404).send("Snippets not Found");
          }
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    });

  app.route('/api/folders/')
    .post((req, res) => {
      let email = jwt.verify(req.headers.authorization, secret).email;
      let path = req.body.path;
      Snippets.makeSubFolderAsync(email, path)
        .then((folder) => {
          res.status(201).send(folder)
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    })
    .delete((req, res) => {
      let email = jwt.verify(req.headers['x-access-token'], secret).email;
      let path = req.query.filePath;
      Snippets.removeFolderAsync(email, path)
        .then((result) => {
          if (result) {
            res.status(201).send("Succesfully removed");
          } else {
            res.status(401).send("Folder was not removed");
          }
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    })

  app.route('/auth/github/failure')
    .get((__, res) => res.status(401).send('Unauthorized'));

  // app.get('/auth/github', passport.authenticate('github'));

  // app.get('/auth/github/callback',
  //   passport.authenticate('github', { failureRedirect: '/auth/github/failure' }), (req, res) => {
  //     console.log('callback stuff happening');
  //     let token = createJWT({ _id: req.user.profile._id });
  //     addReqTokenToRedisAsync(token)
  //       .then(() => res.status(201).send(token))
  //       .catch((err) => {
  //         console.log(err);
  //         res.status(500).send('Error');
  //       });
  //   });

  app.post('/auth/github', (req, res) => {
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.githubSecret,
      redirect_uri: req.body.redirectUri
    };
    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, (err, response, accessToken) => {
      accessToken = qs.parse(accessToken);
      var headers = { 'User-Agent': 'Satellizer' };
      // Step 2. Retrieve profile information about the current user.
      request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, (err, response, profile) => {
        // Step 3a. Link user accounts.
        if (req.header('Authorization')) {
          Users.findOne({ github: profile.id }, (err, existingUser) => {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
            }
            var token = req.header('Authorization').split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            Users.findById(payload.sub, (err, user) => {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.email = user.email || profile.email;
              user.github = profile.id;
              user.avatar_url = user.avatar_url || profile.avatar_url;
              user.name = user.name || profile.name;
              user.save(() => {
                var token = createJWT(user);
                addReqTokenToRedisAsync(token).then(() => res.send({ token: token }))
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          Users.findOne({ github: profile.id }, (err, existingUser) => {
            if (existingUser) {
              var token = createJWT(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.email = user.email || profile.email;
            user.github = profile.id;
            user.avatar_url = profile.avatar_url;
            user.name = profile.name;
            user.save(() => {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        }
      });
    });
  });
}
