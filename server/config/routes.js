'use strict';
let { postSignup, getVerification } = require('./utils.js');
let userController = require('../controllers/userController');
let snippetsController = require('../controllers/snippetsController');

module.exports = (app, express) => {

  // Post signup and email verification 
  app.post('/user/send-email', postSignup);
  app.get('/user/email-verification/:URL', getVerification);

  // Sign in and sign up locally and using github 
  app.post('/user/signin', userController.signin);
  app.post('/user/signup', userController.signup);
  app.post('/user/auth/github', userController.githubLogin);

  // Get or update profile information
  app.route('/user/api/userInfo')
    .get(userController.userInfo)
    .put(userController.updateUserInfo);

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

  app.route('/n')
    .get(snippetsController.rerouteSharedSnippet)

  app.route('/share')
    .get(snippetsController.getSharedSnippet)
};