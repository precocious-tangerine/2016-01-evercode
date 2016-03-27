'use strict';
let morgan = require('morgan');
let express = require('express');

let app = express();
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/', express.static(__dirname + '/client'));
const port = process.env.port || 3001;

const startServer = () => {
	app.listen(port, () => console.log('client-server listening on port ', port));
};

module.exports = startServer
