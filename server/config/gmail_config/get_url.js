var fs = require('fs');
var googleAuth = require('google-auth-library');


const getAuthorizationUrl = (cb) => {
  // Load client secrets
  fs.readFile(__dirname + '/../../client_secret.json', function(err, data) {
    if (err) {
      cb(err);
    } else {
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
      cb(null, authUrl);
    }
  });
}

getAuthorizationUrl(function(err, url) {
  if (err) {
    console.log('err:', err);
  } else {
    console.log('Authorization url is:\n', url);
  }
});
