'use strict';
let morgan = require('morgan');
let Promise = require('bluebird');
let bodyParser = require('body-parser');
let utils = require('./utils.js');

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
  app.use('/api', utils.decode);
};