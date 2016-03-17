"use strict";
var passport = require('passport');
var Promise = require('bluebird');

var config = require('../config');
var Users = Promise.promisifyAll(require('../models/users'));
var Snippets = Promise.promisifyAll(require('../models/snippets'));

var redis = require('redis');
var redisClient = redis.createClient();

var jwt = require('jsonwebtoken');
var secret = 'shhh! it\'s a secret';

var snippetsArray = require('./testSnippetArray.js').testSnippets;

let checkReqAuthorization = (req, res, next) => {
  let token = req.headers['x-access-token'];
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
          token = jwt.sign({ email }, secret);
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
          token = jwt.sign({ email }, secret);
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
      let token = req.headers['x-access-token'];
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
      let email = jwt.verify(req.headers.token, secret);
      req.body.createdby = email;
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
        .then((snippet) => {
          if (snippet) {
            res.status(201).send(snippet);
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
      let email = jwt.verify(req.headers['x-access-token'], secret).email;
      let filepath = req.body.path;
      return Snippets.getSnippetByFilepathAsync(email, filepath)
        .then((dbSnippets) => {
          console.log(dbSnippets);
            if (Array.isArray(dbSnippets) && dbSnippets.length > 0) {
            var fileTreeList = {};
            dbSnippets.forEach((node) => {
              fileTreeList[node.filePath] = node;
            });
            var userFileTree = folderTree.convertToTree(fileTreeList);
            res.status(200).send(userFileTree);
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
      let email = jwt.verify(req.headers['x-access-token'], secret).email;
      let path = `email/${req.body.folder}`;
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
      let path = `email/${req.body.folder}`;
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

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/github/failure' }), (req, res) => {
      let token = jwt.sign({ username: req.user.profile.username }, secret);
      addReqTokenToRedisAsync(token)
        .then(() => res.status(201).send(token))
        .catch((err) => {
          console.log(err);
          res.status(500).send('Error');
        });
    });

  app.route('/api/test-folder-tree')
    .get((req, res) => {
      var snippetObj = {};
      snippetsArray.forEach((snippet) => {
        snippetObj[snippet.filePath] = snippet;
      });
      res.send(snippetObj);
    });
}
