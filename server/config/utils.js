var config = require('../config');
var request = require('request');
var _ = require('lodash');

// unless filters out 'path' from the middleware that uses it
module.exports.unless = function(path, middleware) {
  return function(req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

// getAccessToken takes the code retrieved from GitHub
// and uses it to get the access token from the gitHub oauth endpoint
module.exports.getAccessToken = function(code, callback) {
  var requestParams = {
    url: 'https://github.com/login/oauth/access_token',
    qs: {client_id: config.githubClientId, client_secret: config.githubSecret, code: code},
    method: 'POST'
  };

  request(requestParams, function(error, response) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, response);
    }
  });
};

// getUserInfo uses the access_token for the session user
// to get the user data from the github API
module.exports.getUserInfo = function(token, callback) {
  var requestParams = {
    url: 'https://api.github.com/user?' + token,
    headers: {'User-Agent': 'Good-First-Ticket'},
    qs: {client_id: config.githubClientId, client_secret: config.githubSecret}
  };

  request(requestParams, function(error, response) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, response);
    }
  });
};

// transforms the 'userObj' into an object that
// can be consumed by our mysql db
module.exports.formatUserObj = function(userObj) {

}
