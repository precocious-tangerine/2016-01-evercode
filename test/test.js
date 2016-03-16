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
    User.find({email: 'test@chai.com'}, function(err, result) {
      if (typeof result === 'object') {
        result.remove();
      }
    });

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
  it('should not have an _password property ', function () {
    expect(tempUser).to.not.have.property('_password')
      .that.is.a('string')
      .and.not.equal('just testing');
  });
});

describe('the User Model - getUser', function () {

  before(function(done) {
  var testUser = {
    email: 'test@chai.com',
    _password: 'just testing'
  };
  var tempUser;

  User.find({email: 'test@chai.com'}, function(err, result) {
    if (typeof result === 'object') {
      result.remove();
    }
  });

    User.makeUser(testUser, function(err, returnedUser) {
      tempUser = returnedUser;
      returnedUser.remove();
      done();
    });

    User.getUser(testUser._id, function(err, returnedUser) {
      tempUser = returnedUser;
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
  it('should have a password property', function () {
    expect(tempUser).to.not.have.property('_password')
  });
});

describe('the User Model - updateUser', function () {

  var updateResult;
  var userUpdates = {
    bio: 'I am a test',
  }

  before(function(done) {
    User.updateUser(testUser._id, userUpdates ,function(err, result) {
      updateResult = result;
        User.find({_id: testUser._id}, function(err, returnedUser) {
          testUser = returnedUser;
          returneduser.remove();
          done();
        })
    });
  });
  
  it('should return a results object', function() {
    expect(updateResult).to.be.an('object');
  });

  it('should update the document in the database', function() {
    expect(updateResult).to.have.property('n')
      .that.equals(1);
  });
  
  it('should have an updated bio property that is a string', function () {
    expect(tempUser).to.have.property('bio', 'I am a test')
      .that.is.a('string');
  });
});

describe('the User Model - removeUser', function () {
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };
    var deleteResult;

    User.create(testUser)
      .then(function(returnedUser){
        testUser = returnedUser;
        User.removeUser(testUser._id ,function(err, result) {
          deleteResult = result;
          done();
        })
      })
      .catch(function(err){
        console.log(err);
        done()
      }) 
  });
  
  it('should return a results object', function() {
    expect(deleteResult).to.be.an('object');
  });

  it('should report removal from the database', function() {
    expect(updateResult).to.have.property('n')
      .that.equals(1);
  });
  
  it('should not be able to find the test user', function (done) {
    User.find({_id: testUser._id}, function(err, result){
      expect(result).to.be.null;
      done();
      if (result) {
        result.remove();
      }
    });
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