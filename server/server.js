var express = require('express');
var app = express();
var mongoose = require('mongoose');

if(process.env.EVERCODE_MONGODB_1_PORT_27017_TCP_ADDR ) {
	mongoose.connect(process.env.EVERCODE_MONGODB_1_PORT_27017_TCP_ADDR + ':27017' + '/everCode' );
} else {
	mongoose.connect('mongodb://127.0.0.1:27017/everCode');
}

require(__dirname + '/config/middleware.js')(app, express);
require(__dirname + '/config/routes.js')(app, express);
const port = process.env.PORT || 3000;


const startServer = () => {
	console.log(`server running on port ${port} in ${process.env.NODE_ENV} mode`);
	app.listen(port);
}
// export our app for testing and flexibility, required by index.js
module.exports = startServer;