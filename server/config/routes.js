"use strict";
var Promise = require('bluebird');
var request = require('request');
var qs = require('querystring');
var config = require('../config');
var Users = Promise.promisifyAll(require('../models/users'));
var Snippets = Promise.promisifyAll(require('../models/snippets'));
var jwt = require('jsonwebtoken');
var secret = config.secretToken;

let createJWT = (user) => {
  var payload = {
    sub: user._id,
    email: user.email
  };
  return jwt.sign(payload, secret);
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
          res.status(201).send(token);
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
          res.status(201).send(token);
        })
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
      let email = jwt.verify(req.headers.authorization, secret).email;
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

  app.post('/auth/github', (req, res) => {
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var userApiUrl = 'https://api.github.com/user';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.githubSecret,
      redirect_uri: req.body.redirectUri
    };
    let token;
    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, (err, response, accessToken) => {
      accessToken = qs.parse(accessToken);
      var headers = { 'User-Agent': 'Satellizer' };
      // Step 2. Retrieve profile information about the current user.
      request.get({ url: userApiUrl, qs: accessToken, headers: headers, json: true }, (err, response, profile) => {
        // Step 3a. Link user accounts.
        Users.findOne({ email: profile.email}, (err, existingUser) => {
          if(existingUser) {
            token = createJWT({ email: existingUser.email });
            res.status(201).send({token: token});
          } else {
            let {email, github, avatar_url, name, id} = profile
            Users.makeUserAsync({email, github, avatar_url, name, github: '' + id})
            .then((userObj) => {
              token = createJWT({ email: existingUser.email });
              res.status(201).send({token: token});
            })
            .catch(done);
          }
        });
      });
    });
  });
}
