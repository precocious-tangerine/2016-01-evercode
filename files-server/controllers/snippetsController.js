'use strict';
let Promise = require('bluebird');
let Snippets = Promise.promisifyAll(require('../models/snippets'));

module.exports = {
  getSnippet(req, res) {
    Snippets.getSnippetAsync(req.query._id)
      .then(snippet => {
        if (snippet) {
          res.status(200).send(snippet);
        } else {
          res.status(404).send('Snippet not Found');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  addSnippet(req, res) {
    req.body.createdBy = req.user.email;
    req.body.username = req.user.username;
    Snippets.makeSnippetAsync(req.body)
      .then(snippet => {
        res.status(201).send(snippet);
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  removeSnippet(req, res) {
    Snippets.removeSnippetAsync(req.query.snippetId)
      .then(response => {
        if (response) {
          res.status(201).send(response);
        } else {
          res.status(404).send('Snippet not Found');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  updateSnippet(req, res) {
    Snippets.updateSnippetAsync(req.body.snippetId, req.body.value)
      .then(success => {
        if (success) {
          Snippets.getSnippetAsync(req.body.snippetId).then((snippet) => {
            if (snippet) {
              res.status(201).send(snippet);
            } else {
              res.status(404).send('Snippet not Found');
            }
          });
        } else {
          res.status(404).send('Snippet not Found');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  getPublicSnippets(req, res) {
    Snippets.getPublicAsync()
      .then(snippetList => {
        let fileTreeObj = {};
        snippetList.forEach(snippet => {
          fileTreeObj[snippet.filePath] = {};
          fileTreeObj[snippet.filePath].filePath = snippet.filePath;
          fileTreeObj[snippet.filePath].value = snippet;
        });
        res.status(200).send(fileTreeObj);
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  getUserSnippets(req, res) {
    let token = req.user;
    return Snippets.getSnippetsByUserAsync(token.email)
      .then(results => {
        if (Array.isArray(results) && results.length > 0) {
          let fileTreeObj = {};
          results.forEach((node) => {
            fileTreeObj[node.filePath] = node;
          });
          res.status(200).send(fileTreeObj);
        } else {
          res.status(404).send('Snippets not Found');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  renameUserSnippets(req, res) {
    let email = req.body.email;
    let newName = req.body.username;
    return Snippets.updateSnippetsByUserAsync(email, { username: newName })
      .then(results => {
        if (results && results.nModified !== 0) {
          res.status(200).send(results);
        } else {
          res.status(404).send('Snippets not Found');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  addFolder(req, res) {
    let email = req.user.email;
    let username = req.user.username;
    let path = req.body.path;
    Snippets.makeSubFolderAsync(email, username, path)
      .then(folder => {
        res.status(201).send(folder);
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  removeFolder(req, res) {
    let email = req.user.email;
    let path = req.query.filePath;
    Snippets.removeFolderAsync(email, path)
      .then(result => {
        if (result) {
          res.status(201).send('Succesfully removed');
        } else {
          res.status(401).send('Folder was not removed');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  getSharedSnippet(req, res) {
    let id = req.query.s;
    Snippets.getSnippetAsync(id)
      .then(snippet => {
        if (snippet) {
          let fileTreeObj = {};
          fileTreeObj.share = { filePath: snippet.filePath, value: snippet };
          res.status(200).send(fileTreeObj);
        } else {
          res.status(404).send('Snippet not Found');
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  },
  rerouteSharedSnippet(req, res) {
    let id = req.query.s;
    res.redirect('http://nevercode.com/#/main/editor?s=' + id);
  },

  addSublimeSnippet(req, res) {
    let email = req.user.email;
    let username = req.user.username;
    let fileName = req.body.fileName;
    let shortcut = req.body.shortcut;
    let contents = req.body.contents;
    Snippets.makeSubFolderAsync(email, username, '/' + email + '/' + 'sublime_uploads')
    .then(() => {
      let newSnippet = {
        createdBy: email,
        username: username,
        data: contents,
        name: fileName,
        shortcut: shortcut,
        filePath: '/' + email + '/sublime_uploads/' + fileName
      };
      Snippets.makeSnippetAsync(newSnippet)
        .then((result) => res.status(201).send(result))
        .catch(err => res.status(500).send(err));
    });
  }
};
