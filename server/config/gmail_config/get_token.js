var fs = require('fs');
var googleAuth = require('google-auth-library');

const getAuthorizationToken = (code, cb) => {
  // Load client secrets
  fs.readFile(__dirname + '/../../client_secret.json', (err, data) => {
    if (err) {
      cb(err);
    } else {
      let credentials = JSON.parse(data);
      let clientSecret = credentials.installed.client_secret;
      let clientId = credentials.installed.client_id;
      let redirectUrl = credentials.installed.redirect_uris[0];
      let auth = new googleAuth();
      let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          cb(err);
        } else {
          let file = 'gmail-credentials.json';
          fs.writeFile(file, JSON.stringify(token));
          cb(null, file);
        }
      });
  });
}

if (process.argv.length != 3) {
  console.log('usage: node get_token token');
  process.exit(1);
}
let token = process.argv[2];

getAuthorizationToken(token, (err, file) => {
  if (err) {
    console.log('err:', err);
  } else {
    console.log('authorization token is in:\n', file);
  }
});
