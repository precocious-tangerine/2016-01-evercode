'use strict';

require('babel-polyfill');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/everCode');

//////////////////////////////////////////////////////////
//                   User Model                         //
//////////////////////////////////////////////////////////
var User = require('../server/models/users');

describe('the User Model - basics', function () {
  it('should have makeUser function', function () {
    expect(User.makeUser).to.be.a('function');
  });

  it('should have getUser function', function () {
    expect(User.getUser).to.be.a('function');
  });

  it('should have updateUser function', function () {
    expect(User.updateUser).to.be.a('function');
  });

  it('should have a removeUser function', function () {
    expect(User.removeUser).to.be.a('function');
  });

  it('should have a checkCredentials helper function', function () {
    expect(User.checkCredentials).to.be.a('function');
  });
});

describe('the User Model - makeUser', function () {
  var testUser = {
    email: 'test@chai.com',
    _password: 'just testing'
  };

  var tempUser;
  before(function(done) {
    User.makeUser(testUser, function(err, returnedUser) {
      tempUser = returnedUser;
      returnedUser.remove();
      done();
    });
  });
  

  it('should return an object', function() {
    expect(tempUser).to.be.an('object');
  });

  it('should have a unique id called _id', function() {
    expect(tempUser).to.have.property('_id');
  });
  
  it('should have an email property that is a string', function () {
    expect(tempUser).to.have.property('email', 'test@chai.com')
      .that.is.a('string');
  });
  it('should have a password property that is hashed', function () {
    expect(tempUser).to.have.property('_password')
      .that.is.a('string')
      .and.not.equal('just testing');
  });
});


//////////////////////////////////////////////////////////
//                   Snippet Model                      //
//////////////////////////////////////////////////////////
var Snippet = require('../server/models/snippets');

describe('the Snippet Model', function () {
  it('should have make, get, update and remove functions', function () {
    expect(Snippet.makeSnippet).to.be.a('function');
    expect(Snippet.getSnippet).to.be.a('function');
    expect(Snippet.updateSnippet).to.be.a('function');
    expect(Snippet.removeSnippet).to.be.a('function');
  });
});


//////////////////////////////////////////////////////////
//                   User Routes                        //
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                   Snippet Routes                     //
//////////////////////////////////////////////////////////