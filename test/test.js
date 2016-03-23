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
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
}
describe('the User Model' , function () {
  describe('basics', function () {
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

  describe('makeUser', function () {
    var resultUser;
    before(function(done) {
      var testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      var testMakeUser = function() {
        User.makeUser(testUser, function(err, returnedUser) {
          resultUser = returnedUser;
          done();
          returnedUser.remove();
        });
      }

      removeTestUser(testMakeUser);
    });
    
    it('should return an object', function() {
      expect(resultUser).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultUser).to.have.property('_id');
    });
    
    it('should have an email property that is a string', function () {
      expect(resultUser).to.have.property('email', 'test@chai.com')
        .that.is.a('string');
    });
    it('should have a hashed _password property ', function () {
      expect(resultUser).to.have.property('_password')
        .that.is.a('string')
        .and.not.equal('just testing');
    });
    xit('should have a snippet object', function() {
      expect(resultUser).to.have.property('snippets')
        .that.is.an('object')
    });
    xit('should have a root folder in the snippets object', function() {
      expect(Object.keys(resultUser.snippets)).to.be.length(1);
    });

    it('should have a root folder in the snippets db collection', function(done){
      Snippet.findOne({createdBy: resultUser.email}, function(err, result){
        expect(result).to.have.property('createdBy')
          .that.equals(resultUser.email);
        done();
        if (result) {
        result.remove();
        }
      });
    });
  });

  describe('getUser', function () {

    var resultUser;
    before(function(done) {
      var testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      var testGetUser = function() {
        User.create(testUser)
          .then(function(returnedUser) {
            testUser = returnedUser;
            User.getUser(testUser.email ,function(err, result) {
              resultUser = result;
              done();
            })
          })
          .catch(function(err){
            done()
          }) 
      }

      removeTestUser(testGetUser);

    });
    
    it('should return an object', function() {
      expect(resultUser).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultUser).to.have.property('_id');
    });
    
    it('should have an email property that is a string', function () {
      expect(resultUser).to.have.property('email', 'test@chai.com')
        .that.is.a('string');
    });
    it('should have an _password property', function () {
      expect(resultUser).to.have.property('_password')
    });
  });

  describe('updateUser', function () {

    var resultUser;
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
              resultUser = returnedUser;
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
      expect(resultUser).to.have.property('bio')
        .that.is.a('string')
        .and.equal('I am a test');
    });
  });

  describe('removeUser', function () {

    var resultUser;
    var deleteResult;
    before(function(done) {
      var testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      var testRemoveUser = function () {
        User.create(testUser)
        .then(function(returnedUser){
          resultUser = returnedUser;
          User.removeUser(testUser.email ,function(err, result) {
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
      expect(deleteResult.result).to.be.an('object')
        .that.has.property('ok');
    });

    it('should report removal from the database', function() {
      expect(deleteResult.result).to.have.property('n')
        .that.equals(1);
    });
    
    it('should not be able to find the test user', function (done) {
      User.findOne({_id: resultUser._id}, function(err, result){
        expect(result).to.be.null;
        done();
        if (result) {
          result.remove();
        }
      });
    });
  });
});

//////////////////////////////////////////////////////////
//                   Snippet Model                      //
//////////////////////////////////////////////////////////
var Snippet = require('../server/models/snippets');

var removeTestSnippet = function(callback){
  Snippet.findOne({data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets'}, function(err, result) {
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
}
describe('the Snippet Model', function(){
  describe('Snippet basics', function () {
    it('should have makeSnippet function', function () {
      expect(Snippet.makeSnippet).to.be.a('function');
    });

    it('should have getSnippet function', function () {
      expect(Snippet.getSnippet).to.be.a('function');
    });

    it('should have updateSnippet function', function () {
      expect(Snippet.updateSnippet).to.be.a('function');
    });

    it('should have a removeSnippet function', function () {
      expect(Snippet.removeSnippet).to.be.a('function');
    });
  });

  describe('makeSnippet', function () {

    var resultSnippet;
    before(function(done) {

      var testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip'
      };

      var testMakeSnippet = function() {
        Snippet.makeSnippet(testSnippet, function(err, returnedSnippet) {
          resultSnippet = returnedSnippet;
          done();
          returnedSnippet.remove();
        });
      }

      removeTestSnippet(testMakeSnippet);
    });


    it('should return an object', function() {
      expect(resultSnippet).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultSnippet).to.have.property('_id');
    });

    it('should have a property called _createdAt that is a Date', function() {
      expect(resultSnippet).to.have.property('_createdAt');
    });

    it('should have a property called _updatedAt At that is a Date', function() {
      expect(resultSnippet).to.have.property('_updatedAt');
    });
    
    it('should have an createdBy property that is a string', function () {
      expect(resultSnippet).to.have.property('createdBy', 'test@chai.com')
        .that.is.a('string');
    });

    it('should have a data property that is a string', function () {
      expect(resultSnippet).to.have.property('data')
        .that.is.a('string');
    });

    it('should have a filePath property that is a string', function () {
      expect(resultSnippet).to.have.property('filePath')
        .that.is.a('string');
    });

    it('should have a name property that is a string', function () {
      expect(resultSnippet).to.have.property('name', 'test.snip')
        .that.is.a('string');
    });

    it('should have a public property that is a boolean and defaulted to true', function () {
      expect(resultSnippet).to.have.property('public', true)
        .that.is.a('boolean');
    });
  })

  describe('getSnippet', function () {

    var resultSnippet;
    before(function(done) {

      var testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip'
      };

      var testGetSnippet = function() {
        Snippet.create(testSnippet)
          .then(function(returnedSnippet) {
            testSnippet = returnedSnippet;
            Snippet.getSnippet(testSnippet._id ,function(err, result) {
              resultSnippet = result;
              done();
            })
          })
          .catch(function(err){
            done()
          }) 
      }

      removeTestSnippet(testGetSnippet);
    });


    it('should return an object', function() {
      expect(resultSnippet).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultSnippet).to.have.property('_id');
    });
    
    it('should have an createdBy property that is a string', function () {
      expect(resultSnippet).to.have.property('createdBy', 'test@chai.com')
        .that.is.a('string');
    });

    it('should have a data property that is a string', function () {
      expect(resultSnippet).to.have.property('data')
        .that.is.a('string');
    });

    it('should have a filePath property that is a string', function () {
      expect(resultSnippet).to.have.property('filePath')
        .that.is.a('string');
    });

    it('should have a name property that is a string', function () {
      expect(resultSnippet).to.have.property('name', 'test.snip')
        .that.is.a('string');
    });

    it('should have a public property that is a boolean and defaulted to true', function () {
      expect(resultSnippet).to.have.property('public', true)
        .that.is.a('boolean');
    });
  })

  describe('updateSnippet', function () {

    var resultSnippet;
    var updateResult;
    var oldSnippet;
    var snippetUpdates = {
      filePath: 'test@chai.com/updates/updatedtest.snip',
      name:'updatedtest.snip'
    }
    var testSnippet = {
      createdBy: 'test@chai.com',
      data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
      filePath: 'test@chai.com/test.snip',
      name: 'test.snip'
    };

    before(function(done) {
      var testUpdateSnippet = function () {
        Snippet.create(testSnippet)
        .then(function(returnedSnippet) {
          oldSnippet = returnedSnippet;
          Snippet.updateSnippet(returnedSnippet._id, snippetUpdates ,function(err, result) {
            updateResult = result;
            Snippet.findOne({_id: returnedSnippet._id}, function(err, returnedSnippet) {
              resultSnippet = returnedSnippet;
              done();
            })
          });
        })
        .catch(function(err){
          console.log(err);
          done()
        }) 
      }

      removeTestSnippet(testUpdateSnippet);
      
    });
    
    it('should return a results object', function() {
      expect(updateResult).to.be.an('object');
    });

    it('should report updating the document from the database', function() {
      expect(updateResult).to.have.property('n')
        .that.equals(1);
    });
    
    it('should update properties', function () {
      expect(resultSnippet).to.have.property('filePath','test@chai.com/updates/updatedtest.snip')
        .that.is.a('string');
      expect(resultSnippet).to.have.property('name','updatedtest.snip')
        .that.is.a('string');
    });

    it('should change the _updatedAt property of the document in the database', function() {
      expect(resultSnippet).to.have.property('_updatedAt')
        .that.is.not.equal(oldSnippet._updatedAt);
    });
  })

  describe('removeSnippet', function () {

    var resultSnippet;
    var deleteResult;
    before(function(done) {
      var testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/test.snip',
        name: 'test.snip'
      };

      var testRemoveSnippet = function () {
        Snippet.create(testSnippet)
        .then(function(returnedSnippet){
          resultSnippet = returnedSnippet;
          Snippet.removeSnippet(returnedSnippet._id ,function(err, result) {
            deleteResult = result;
            done();
          })
        })
        .catch(function(err){
          console.log(err);
          done()
        })
      }

      removeTestSnippet(testRemoveSnippet);

    });

    it('should return a results object', function() {
      expect(deleteResult.result).to.be.an('object')
        .that.has.property('ok');
    });

    it('should report removal from the database', function() {
      expect(deleteResult.result).to.have.property('n')
        .that.equals(1);
    });
    
    it('should not be able to find the test snippet', function (done) {
      Snippet.findOne({_id: resultSnippet._id}, function(err, result) {
        expect(result).to.be.null;
        done();
        if (result) {
          result.remove();
        }
      });
    });
  })

  describe('Folder basics', function () {

    it('should have a makeSubFolder function', function () {
      expect(Snippet.makeSubFolder).to.be.a('function');
    });

    it('should have a makeRootFolder function', function () {
      expect(Snippet.makeRootFolder).to.be.a('function');
    });

    it('should have a removeFolder function', function () {
      expect(Snippet.makeRootFolder).to.be.a('function');
    });
  });

  describe('makeSubFolder', function () {

  })

  describe('makeRootFolder', function () {

  })

  describe('removeFolder', function () {

  })

  describe('Snippet Getters', function() {

    it('should have a getSnippetByFilepath function', function() {
      expect(Snippet.getSnippetByFilepath).to.be.a('function');
    })

    it('should have a getSnippetsByUser function', function() {
      expect(Snippet.getSnippetsByUser).to.be.a('function');
    })

    xit('should have a getSnippetInfoByUser function', function() {
      expect(Snippet.getSnippetInfoByUser).to.be.a('function');
    })

    xit('should have a getSnippetInfoByFolder function', function() {
      expect(Snippet.getSnippetInfoByFolder).to.be.a('function');
    })

    it('should have a getSnippetsByFolder function', function() {
      expect(Snippet.getSnippetsByFolder).to.be.a('function');
    })
  });
});

//////////////////////////////////////////////////////////
//                   Auth Routes                        //
//////////////////////////////////////////////////////////

describe('Auth Routes', function () {

  var request = require('supertest');
  var express = require('express');
  var testApp = express();
  var Routes = require('../server/config/routes.js')(testApp, express);
  var config = require('../server/config.js')

  describe('basic', function() {
    
    it('should have a /signup route',function(done) {
      request(testApp)
        .post('/signup')
        .send()
        .expect(500)
        .end(function(err,res){
          console.log(res.body)
          console.log(err);
          if (err) {
            done();
          } else {
            expect(err).to.be.instanceOf(Error);
            done()
          }
        })
    });

    it('should have a /signin route',function() {
      request(testApp)
        .post('/signin')
        .send({email: 0, password: 0})
        .expect(401)
        .end(function(err,res){
          if (err) {
            done(err);
          } else {
            expect(res.body).to.equal("Unathorized")
            done()
          }
        })
    });
  });

  describe('/signup', function() {

    it('should be able to sign up a test user and be returned a token', function(done) {
      request(testApp)
        .post('/signup')
        .send({email: "test@chai.com", password: "test"})
        .expect(201)
        .end(function(err,res){
          if (err) {
            done(err);
          } else {
            expect(res.status)
            expect(res.msg).to.be.a('string')
              that.has.value('Authorized')
            done()
          }
        })
    });

    it('should not be able to sign up with the same email', function(done) {
      request(testApp)
        .post('/signup')
        .send({email: "test@chai.com", password: "test"})
        .expect(500)
        .end(function(err,res){
          if (err) {
            done(err);
          } else {
            expect(res.status)
            expect(res.msg).to.be.a('string')
              that.has.value('Authorized')
            done()
          }
        })
    });
  });

  describe('/signin', function(){

    it('should be able to sign in with appropriate credentials and recieve a token', function(done) {
      request(testApp)
        .post('/signup')
        .send({email: "test@chai.com", password: "test"})
        .expect(500)
        .end(function(err,res){
          if (err) {
            done(err);
          } else {
            expect(res.status)
            expect(res.msg).to.be.a('string')
              that.has.value('Authorized')
            done()
          }
        })
    });

    it('should not be able to sign in with inappropriate credentials', function(done) {
      request(testApp)
        .post('/signup')
        .send({email: "test@chai.com", password: "test"})
        .expect(500)
        .end(function(err,res){
          if (err) {
            done(err);
          } else {
            expect(res.status)
            expect(res.msg).to.be.a('string')
              that.has.value('Authorized')
            done()
          }
        })
    });

  });

  describe('/api/userInfo', function() {

    it('should not be able to get user info without a token', function(done) {

    });

    it('should be able to get user info with a token', function(done) {
      
    });

  });

})

//////////////////////////////////////////////////////////
//                   Snippet Routes                     //
//////////////////////////////////////////////////////////

describe('Snippet Routes', function() {

  describe('api/snippets', function() {

    describe('Unauthorized', function() {

      it('it should not be able to post a snippet without a token', function(done) {

      });

      it('it should not be able to get a private snippet without a token', function(done) {
        
      });

      it('it should be able to get a public snippet without a token', function(done) {
        
      });

      it('it should not be able to update a snippet without a token', function(done) {
        
      });

      it('it should not be able to delete a snippet without a token', function(done) {
        
      });

    });

    describe('Authorized', function() {

      it('it should be able to post a snippet when it has a token', function(done) {

      });

      it('it should be able to get a private snippet when it has a token', function(done) {
        
      });

      it('it should be able to update a snippet when it has a token', function(done) {
        
      });

      it('it should be able to delete a snippet when it has a token', function(done) {
        
      });

    });

  })

  describe('api/user/snippets', function() {

    describe('Unauthorized', function() {

      it('should return 401 for a get request without a token', function(done) {

      });

    });

    describe('Authorized', function() {

      it('should return 201 and an array of snippets for a get request with a token', function(done) {

      });

      it('should return 404 and an emptry array for a user with no snippets', function(done) {

      });

    });

  });

  describe('api/folders', function() {

    describe('Unauthorized', function() {

    });

    describe('Authorized', function() {

    });

  });

  describe

});
