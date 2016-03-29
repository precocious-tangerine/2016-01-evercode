'use strict';
let { postSignup, getVerification } = require('./utils.js');
let userController = require('../controllers/userController');

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

  app.route('/user/api/sublime-secret')
    .get(userController.generateSublimeSecret)
  app.route('/user/sublime-secret')
    .get(userController.verifySublimeSecret)
};
