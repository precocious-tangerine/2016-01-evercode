"use strict";
var Promise = require('bluebird');
var request = require('request');
var qs = require('querystring');
var passport = require('passport');
var config = require('../config');
var Users = Promise.promisifyAll(require('../models/users'));
var Snippets = Promise.promisifyAll(require('../models/snippets'));
var jwt = require('jsonwebtoken');
var secret = 'shhh! it\'s a secret';

let createJWT = (user) => {
  var payload = {
    sub: user._id,
    email: user.email
  };
  return jwt.sign(payload, secret);
}


module.exports = (app, express, redisClient) => {
  
  app.route('/signin')
    .get((req,res) => {
      if(req.isAuthenticated()) {
        res.status(200).send(createJWT(req.session));
      } else {
        res.status(404).send('Not Authorized');
      }
    })
    .post(passport.authenticate('signin', { failureRedirect: '/'}), (req, res) =>{
       res.send(createJWT(req.session));
      });

  app.route('/signup')
    .post(passport.authenticate('signup', { failureRedirect: '/'}), (req, res) => {
        res.send(createJWT(req.session));
      });

  app.route('/signout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });

  app.route('/auth/github/failure')
    .get((__, res) => res.status(401).send('Unauthorized'));

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/github/failure' }), (req, res) => {
      res.send(createJWT(req.session));
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
      let email = req.session.passport.user.email;
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
      Snippets.removeSnippetAsync(req.body.snippetId)
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
      return Snippets.getSnippetsByUserAsync(req.session.passport.user.email)
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
      let path = req.body.path;
      Snippets.makeSubFolderAsync(req.session.passport.user.email, path)
        .then((folder) => {
          res.status(201).send(folder)
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err);
        })
    })
    .delete((req, res) => {
      let email = req.session.passport.user.email;
      let path = `${email}/${req.body.folder}`;
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

}






























  //   var accessTokenUrl = 'https://github.com/login/oauth/access_token';
  //   var userApiUrl = 'https://api.github.com/user';
  //   var params = {
  //     code: req.body.code,
  //     client_id: req.body.clientId,
  //     client_secret: config.githubSecret,
  //     redirect_uri: req.body.redirectUri
  //   };
  //   // Step 1. Exchange authorization code for access token.
  //   request.get({ url: accessTokenUrl, qs: params }, (err, response, accessToken) => {
  //     accessToken = qs.parse(accessToken);
  //     var headers = { 'User-Agent': 'Satellizer' };
  //     // Step 2. Retrieve profile information about the current user.
  //     request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, (err, response, profile) => {
  //       // Step 3a. Link user accounts.
  //       if (req.header('Authorization')) {
  //         Users.findOne({ github: profile.id }, (err, existingUser) => {
  //           if (existingUser) {
  //             return res.status(409).send({ message: 'There is already a GitHub account that belongs to you' });
  //           }
  //           var token = req.header('Authorization').split(' ')[1];
  //           var payload = jwt.decode(token, config.TOKEN_SECRET);
  //           Users.findById(payload.sub, (err, user) => {
  //             if (!user) {
  //               return res.status(400).send({ message: 'User not found' });
  //             }
  //             user.email = user.email || profile.email;
  //             user.github = profile.id;
  //             user.avatar_url = user.avatar_url || profile.avatar_url;
  //             user.name = user.name || profile.name;
  //             user.save(() => {
  //               var token = createJWT(user);
  //               addReqTokenToRedisAsync(token).then(() => res.send({ token: token }))
  //             });
  //           });
  //         });
  //       } else {
  //         // Step 3b. Create a new user account or return an existing one.
  //         Users.findOne({ github: profile.id }, (err, existingUser) => {
  //           if (existingUser) {
  //             var token = createJWT(existingUser);
  //             return res.send({ token: token });
  //           }
  //           var user = new User();
  //           user.email = user.email || profile.email;
  //           user.github = profile.id;
  //           user.avatar_url = profile.avatar_url;
  //           user.name = profile.name;
  //           user.save(() => {
  //             var token = createJWT(user);
  //             res.send({ token: token });
  //           });
  //         });
  //       }
  //     });
  //   });
  // });