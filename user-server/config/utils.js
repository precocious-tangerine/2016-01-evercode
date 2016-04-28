'use strict';
let Promise = require('bluebird');
let request = require('request');
let setup = require('../../setup.js');
let jwt = require('jsonwebtoken');
let secret = setup.secretToken;

let createJWT = (user) => {
  let payload = {
    username: user.username,
    email: user.email
  };
  return jwt.sign(payload, secret);
};
module.exports.createJWT = createJWT;

module.exports.decode = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(403).send('Please login');
  }
  try {
    req.user = jwt.decode(token, secret);
    next();
  } catch (error) {
    return next(error);
  }
}; 

//Declare here first for use locally
module.exports.createRootFolderAsync = (userObj) => {
  let token = createJWT(userObj);
  return new Promise((resolve, reject) => {
    let fullUrl = setup.server + '/files/api/folders';
    request({
      url: fullUrl,
      method: 'POST',
      headers: {
        'authorization': token
      },
      json: {
        path: userObj.email
      } 
    }, function(error, resp) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(resp);
      }
    });
  });
};


