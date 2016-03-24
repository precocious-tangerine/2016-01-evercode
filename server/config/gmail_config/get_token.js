'use strict';
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let googleAuth = Promise.promisifyAll(require('google-auth-library'));

const getAuthorizationToken = (code) => {
  // Load client secrets
  return fs.readFileAsync(__dirname + '/../../client_secret.json')
    .then(data => {
      let credentials = JSON.parse(data);
      let clientSecret = credentials.installed.client_secret;
      let clientId = credentials.installed.client_id;
      let redirectUrl = credentials.installed.redirect_uris[0];
      let auth = new googleAuth();
      let oauth2Client = Promise.promisifyAll(new auth.OAuth2(clientId, clientSecret, redirectUrl));

      return oauth2Client.getTokenAsync(code)
        .then(token => {
          let file = 'gmail-credentials.json';
          return fs.writeFile(file, JSON.stringify(token))
            .then(() => file);
        })
        .catch(err => console.log('err is ', err));
    });
};

if (process.argv.length !== 3) {
  console.log('usage: node get_token token');
  process.exit(1);
}

let token = process.argv[2];

getAuthorizationToken(token)
  .then(file => console.log('authorization token is in:\n', file))
  .catch(err => console.log('Err: ', err));