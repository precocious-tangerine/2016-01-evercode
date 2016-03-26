 'use strict';
 let Promise = require('bluebird');
 let Snippets = Promise.promisifyAll(require('../models/snippets'));
 let bases = require('bases');

 module.exports = {
   getSnippet: ((req, res) => {
     Snippets.getSnippetAsync(req.query['_id'])
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
   }),
   addSnippet: ((req, res) => {
     req.body.createdBy = req.user.email;
     req.body.username = req.user.username;
     Snippets.makeSnippetAsync(req.body)
       .then(snippet => {
         res.status(201).send(snippet);
       }).catch((err) => {
         console.log(err);
         res.status(500).send(err);
       });
   }),

   removeSnippet: ((req, res) => {
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
   }),
   updateSnippet: ((req, res) => {
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
   }),

   getPublicSnippets: ((req, res) => {
     Snippets.getPublicAsync()
       .then(snippetList => {
          let fileTreeObj = {};
          snippetList.forEach(snippet => {
            fileTreeObj[snippet.filePath] = snippet;
          });
          res.status(200).send(fileTreeObj);
       }).catch((err) => {
         console.log(err);
         res.status(500).send(err);
       });
   }),
   getUserSnippets: ((req, res) => {
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
   }),
   addFolder: ((req, res) => {
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
   }),

   removeFolder: ((req, res) => {
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
   }),

   getSharedSnippet: ((req, res) => {
      var id = req.query.s;
      console.log(id);
      Snippets.getSnippetAsync(id)
       .then(snippet => {
         if (snippet) {
           res.status(200).send({
            share: snippet
           });
         } else {
           res.status(404).send('Snippet not Found');
         }
       }).catch((err) => {
         console.log(err);
         res.status(500).send(err);
       });
   }),

   rerouteSharedSnippet: ((req,res ) =>{
    var id = req.query.s;
    res.redirect('/#/main/editor?s='+ id);
   })


 };
