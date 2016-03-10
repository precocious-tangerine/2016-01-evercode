var express = require('express');
var app = express();
var db = require('./db/database'); 

// middleware.js houses all the middleware that is run by express
require(__dirname + '/config/middleware.js')(app, express);

// routes.js defines the application's endpoints
require(__dirname + '/config/routes.js')(app, express);

var port = process.env.PORT || 3000;

console.log(`server running on port ${port} in ${process.env.NODE_ENV} mode`);
// start listening to requests on port 3000
app.listen(port);

// export our app for testing and flexibility, required by index.js
module.exports = app;