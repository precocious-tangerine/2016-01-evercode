'use strict';

var expect = require('chai').expect;
require('babel-polyfill');

var User = require('../server/models/users');


describe('the User Model', function () {
  it('should have a function', function () {
    expect(User.makeUser).to.be.a('function');
  });
});