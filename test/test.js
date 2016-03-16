'use strict';

require('babel-polyfill');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/everCodeTest');

//////////////////////////////////////////////////////////
//                   User Model                         //
//////////////////////////////////////////////////////////
var User = require('../server/models/users');

var removeTestUser = function(callback){
  User.findOne({email: 'test@chai.com'}, function(err, result) {
    console.log("removeTestUser", err, result)
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
}

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
  var tempUser;
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    var testMakeUser = function() {
      User.makeUser(testUser, function(err, returnedUser) {
        tempUser = returnedUser;
        done();
        returnedUser.remove();
      });
    }

    removeTestUser(testMakeUser);
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
  it('should have a hashed _password property ', function () {
    expect(tempUser).to.have.property('_password')
      .that.is.a('string')
      .and.not.equal('just testing');
  });
});

describe('the User Model - getUser', function () {

  var tempUser;
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    var testGetUser = function() {
      User.create(testUser)
        .then(function(returnedUser) {
          console.log("create test user", returnedUser);
          testUser = returnedUser;
          User.getUser(testUser.email ,function(err, result) {
            console.log("getUser result", err, result);
            tempUser = result;
            done();
          })
        })
        .catch(function(err){
          console.log(err);
          done()
        }) 
    }

    removeTestUser(testGetUser);

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
  it('should have an _password property', function () {
    expect(tempUser).to.have.property('_password')
  });
});

describe('the User Model - updateUser', function () {

  var tempUser;
  var updateResult;
  var userUpdates = {
    bio: 'I am a test',
  }
  var testUser = {
     email: 'test@chai.com',
    _password: 'just testing'
  };

  before(function(done) {
    var testUpdateUser = function () {
      User.create(testUser)
      .then(function(returnedUser) {
        testUser = returnedUser;
        User.updateUser(testUser.email, userUpdates ,function(err, result) {
          updateResult = result;
          User.findOne({_id: testUser._id}, function(err, returnedUser) {
            tempUser = returnedUser;
            done();
          })
        });
      })
      .catch(function(err){
        console.log(err);
        done()
      }) 
    }

    removeTestUser(testUpdateUser);
    
  });
  
  it('should return a results object', function() {
    expect(updateResult).to.be.an('object');
  });

  it('should report updating the document from the database', function() {
    expect(updateResult).to.have.property('n')
      .that.equals(1);
  });
  
  it('should update properties', function () {
    expect(tempUser).to.have.property('bio')
      .that.is.a('string')
      .and.equal('I am a test');
  });
});

describe('the User Model - removeUser', function () {

  var tempUser;
  var deleteResult;
  before(function(done) {
    var testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    var testRemoveUser = function () {
      User.create(testUser)
      .then(function(returnedUser){
        tempUser = returnedUser;
        User.removeUser(testUser._id ,function(err, result) {
          deleteResult = result;
          done();
        })
      })
      .catch(function(err){
        console.log(err);
        done()
      })
    }

    removeTestUser(testRemoveUser);

  });
  
  it('should return a results object', function() {
    expect(deleteResult).to.be.an('object')
      .that.has.property('ok');
  });

  it('should report removal from the database', function() {
    expect(deleteResult).to.have.property('n')
      .that.equals(1);
  });
  
  it('should not be able to find the test user', function (done) {
    User.findOne({_id: tempUser._id}, function(err, result){
      console.log("finding test user after delete", err,result)
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