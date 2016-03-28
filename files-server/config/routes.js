'use strict';
let snippetsController = require('../controllers/snippetsController');
module.exports = (app, express) => {
  // Access, add, remove or update user snippets
  app.route('/files/api/snippets')
    .get(snippetsController.getSnippet)
    .post(snippetsController.addSnippet)
    .delete(snippetsController.removeSnippet)
    .put(snippetsController.updateSnippet);

  // Get all public snippets available
  app.get('/files/public/snippets', snippetsController.getPublicSnippets);

  // Get all user snippets available
  app.get('/files/api/user/snippets', snippetsController.getUserSnippets);

  // Add or remove user folder 
  app.route('/files/api/folders')
    .post(snippetsController.addFolder)
    .delete(snippetsController.removeFolder);

  app.route('files/n')
    .get(snippetsController.rerouteSharedSnippet);

  app.route('files/share')
    .get(snippetsController.getSharedSnippet);
};
