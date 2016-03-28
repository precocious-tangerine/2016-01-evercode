'use strict';
let setup = require('../../setup.js');
let jwt = require('jsonwebtoken');
let secret = setup.secretToken;


module.exports.createJWT = (user) => {
  let payload = {
    username: user.username,
    email: user.email
  };
  return jwt.sign(payload, secret);
};

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
