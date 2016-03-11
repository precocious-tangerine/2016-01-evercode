var express = require('express');
var app = express();
var db = require('./db/database'); 

require(__dirname + '/config/middleware.js')(app, express);
require(__dirname + '/config/routes.js')(app, express);
var port = process.env.PORT || 3000;

console.log(`server running on port ${port} in ${process.env.NODE_ENV} mode`);
app.listen(port);

// export our app for testing and flexibility, required by index.js
module.exports = app;