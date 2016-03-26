'use strict';
let { postSignup, getVerification } = require('./utils.js');
let userController = require('../controllers/userController');
let snippetsController = require('../controllers/snippetsController');

module.exports = (app, express) => {

  // Post signup and email verification 
  app.post('/send-email', postSignup);
  app.get('/email-verification/:URL', getVerification);

  // Sign in and sign up locally and using github 
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.post('/auth/github', userController.githubLogin);

  // Get or update profile information
  app.route('/api/userInfo')
    .get(userController.userInfo)
    .put(userController.updateUserInfo);

  // Access, add, remove or update user snippets
  app.route('/api/snippets')
    .get(snippetsController.getSnippet)
    .post(snippetsController.addSnippet)
    .delete(snippetsController.removeSnippet)
    .put(snippetsController.updateSnippet);

  // Get all public snippets available
  app.get('/snippets', snippetsController.getPublicSnippets);

  // Get all user snippets available
  app.get('/api/user/snippets/', snippetsController.getUserSnippets);

  // Add or remove user folder 
  app.route('/api/folders/')
    .post(snippetsController.addFolder)
    .delete(snippetsController.removeFolder);

  app.route('/n')
    .get(snippetsController.getSharedSnippet)
};