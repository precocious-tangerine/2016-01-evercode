'use strict';
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let googleAuth = Promise.promisifyAll(require('google-auth-library'));


const getAuthorizationUrl = (cb) => {
  // Load client secrets
  return fs.readFileAsync(__dirname + '/../../client_secret.json')
    .then((data) => {
      let credentials = JSON.parse(data);
      let clientSecret = credentials.installed.client_secret;
      let clientId = credentials.installed.client_id;
      let redirectUrl = credentials.installed.redirect_uris[0];
      let auth = new googleAuth();
      let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send']
      });
      return authUrl;
    });
};

getAuthorizationUrl()
  .then((url) => console.log('Authorization url is:\n', url))
  .catch(err => console.log('err is', err));