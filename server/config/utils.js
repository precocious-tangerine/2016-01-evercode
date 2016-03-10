var config = require('../config');
var request = require('request');
var _ = require('lodash');


// getUserInfo uses the access_token for the session user
// to get the user data from the github API
module.exports.getUserInfo = (token, callback) => {
  var requestParams = {
    url: 'https://api.github.com/user?' + token,
    headers: {'User-Agent': 'evercode'},
    qs: {client_id: config.githubClientId, client_secret: config.githubSecret}
  };

  request(requestParams, (error, response) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, response);
    }
  });
};

// transforms the 'userObj' into an object that
// can be consumed by our mysql db
module.exports.formatUserObj = (userObj) => {

}
