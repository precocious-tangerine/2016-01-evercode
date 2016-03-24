'use strict';
var morgan = require('morgan');
var Promise = require('bluebird');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var secret = require('../config').secretToken;

module.exports = (app, express) => {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  app.use('/', express.static(__dirname + '/../../client'));

  app.use('/api', (req, res, next) => {
    var token = req.headers.authorization;
    if (!token) {
      return res.status(403).send('Please login');
    }
    try {
      req.user = jwt.decode(token, secret);
      next();
    } catch (error) {
      return next(error);
    }
  });
};

module.exports.createJWT = (user) => {
  var payload = {
    username: user.username,
    email: user.email
  };
  return jwt.sign(payload, secret);
};