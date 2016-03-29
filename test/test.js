'use strict';
require('babel-polyfill');
let expect = require('chai').expect;
let mongoose = require('mongoose');
let Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/everCodeTest');

//////////////////////////////////////////////////////////
//                   User Model                         //
//////////////////////////////////////////////////////////
let User = require('../user-server/models/users');
let Users = Promise.promisifyAll(require('../user-server/models/users'));

let removeTestUser = function(callback) {
  User.findOne({ email: 'test@chai.com' }, function(err, result) {
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
};
describe('the User Model', function() {
  describe('basics', function() {
    it('should have makeUser function', function() {
      expect(User.makeUser).to.be.a('function');
    });

    it('should have getUser function', function() {
      expect(User.getUser).to.be.a('function');
    });

    it('should have updateUser function', function() {
      expect(User.updateUser).to.be.a('function');
    });

    it('should have a removeUser function', function() {
      expect(User.removeUser).to.be.a('function');
    });

    it('should have a checkCredentials helper function', function() {
      expect(User.checkCredentials).to.be.a('function');
    });
  });

  describe('makeUser', function() {
    let resultUser;
    before(function(done) {
      let testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      let testMakeUser = function() {
        Users.makeUserAsync(testUser)
          .then(returnedUser => {
            resultUser = returnedUser;
            done();
          });
      };

      removeTestUser(testMakeUser);
    });

    it('should return an object', function() {
      expect(resultUser).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultUser).to.have.property('_id');
    });

    it('should have an email property that is a string', function() {
      expect(resultUser).to.have.property('email', 'test@chai.com')
        .that.is.a('string');
    });
    it('should have a hashed _password property ', function() {
      expect(resultUser).to.have.property('_password')
        .that.is.a('string')
        .and.not.equal('just testing');
    });
    it('should have a root folder in the snippets db collection', function(done) {
      Snippet.findOne({ createdBy: resultUser.email }, function(err, result) {
        expect(result).to.have.property('createdBy')
          .that.equals(resultUser.email);
        done();
        if (result) {
          result.remove();
        }
      });
    });
  });

  describe('getUser', function() {

    let resultUser;
    before(function(done) {
      let testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      let testGetUser = function() {
        User.create(testUser)
          .then(returnedUser => {
            testUser = returnedUser;
            Users.getUserAsync(testUser.email)
              .then(result => {
                resultUser = result;
                done();
              })
              .catch(err => {
                done();
              });
          })
          .catch(function(err) {
            done();
          });
      };

      removeTestUser(testGetUser);

    });

    it('should return an object', function() {
      expect(resultUser).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultUser).to.have.property('_id');
    });

    it('should have an email property that is a string', function() {
      expect(resultUser).to.have.property('email', 'test@chai.com')
        .that.is.a('string');
    });
    it('should have an _password property', function() {
      expect(resultUser).to.have.property('_password');
    });
  });

  describe('updateUser', function() {

    let resultUser, updateResult;
    let userUpdates = {
      theme: 'twilight',
    };
    let testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    before(function(done) {
      let testUpdateUser = function() {
        User.create(testUser)
          .then(function(returnedUser) {
            testUser = returnedUser;
            User.updateUser(testUser.email, userUpdates, function(err, result) {
              updateResult = result;
              User.findOne({ _id: testUser._id }, function(err, returnedUser) {
                resultUser = returnedUser;
                done();
              });
            });
          })
          .catch(function(err) {
            console.log(err);
            done();
          });
      };

      removeTestUser(testUpdateUser);

    });

    it('should return a results object', function() {
      expect(updateResult).to.be.an('object');
    });

    it('should report updating the document from the database', function() {
      expect(updateResult).to.have.property('n')
        .that.equals(1);
    });

    it('should update properties', function() {
      expect(resultUser).to.have.property('theme')
        .that.is.a('string')
        .and.equal('twilight');
    });
  });

  describe('removeUser', function() {

    let resultUser, deleteResult;
    before(function(done) {
      let testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      let testRemoveUser = function() {
        User.create(testUser)
          .then(function(returnedUser) {
            resultUser = returnedUser;
            User.removeUser(testUser.email, function(err, result) {
              deleteResult = result;
              done();
            });
          })
          .catch(function(err) {
            console.log(err);
            done();
          });
      };

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

    it('should not be able to find the test user', function(done) {
      User.findOne({ _id: resultUser._id }, function(err, result) {
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
let Snippet = require('../files-server/models/snippets');
let Snippets = Promise.promisifyAll(require('../files-server/models/snippets'));
let removeTestSnippet = function(callback) {
  Snippet.findOne({ data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets' }, function(err, result) {
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
};
describe('the Snippet Model', function() {
  describe('Snippet basics', function() {
    it('should have makeSnippet function', function() {
      expect(Snippet.makeSnippet).to.be.a('function');
    });

    it('should have getSnippet function', function() {
      expect(Snippet.getSnippet).to.be.a('function');
    });

    it('should have updateSnippet function', function() {
      expect(Snippet.updateSnippet).to.be.a('function');
    });

    it('should have a removeSnippet function', function() {
      expect(Snippet.removeSnippet).to.be.a('function');
    });
  });

  describe('makeSnippet', function() {

    let resultSnippet;
    before(function(done) {

      let testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip',
        username: 'test'
      };

      let testMakeSnippet = function() {
        Snippets.makeSnippetAsync(testSnippet)
          .then(returnedSnippet => {
            resultSnippet = returnedSnippet;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

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

    it('should have an createdBy property that is a string', function() {
      expect(resultSnippet).to.have.property('createdBy', 'test@chai.com')
        .that.is.a('string');
    });

    it('should have a data property that is a string', function() {
      expect(resultSnippet).to.have.property('data')
        .that.is.a('string');
    });

    it('should have a filePath property that is a string', function() {
      expect(resultSnippet).to.have.property('filePath')
        .that.is.a('string');
    });

    it('should have a name property that is a string', function() {
      expect(resultSnippet).to.have.property('name', 'test.snip')
        .that.is.a('string');
    });

    it('should have a public property that is a boolean and defaulted to true', function() {
      expect(resultSnippet).to.have.property('public', true)
        .that.is.a('boolean');
    });
  });

  describe('getSnippet', function() {

    let resultSnippet;
    before(function(done) {

      let testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip',
        username: 'test'
      };

      let testGetSnippet = function() {
        Snippet.create(testSnippet)
          .then(function(returnedSnippet) {
            testSnippet = returnedSnippet;
            Snippets.getSnippetAsync(testSnippet._id)
              .then(result => {
                resultSnippet = result;
                done();
              });
          })
          .catch(function(err) {
            done();
          });
      };

      removeTestSnippet(testGetSnippet);
    });


    it('should return an object', function() {
      expect(resultSnippet).to.be.an('object');
    });

    it('should have a unique id called _id', function() {
      expect(resultSnippet).to.have.property('_id');
    });

    it('should have an createdBy property that is a string', function() {
      expect(resultSnippet).to.have.property('createdBy', 'test@chai.com')
        .that.is.a('string');
    });

    it('should have a data property that is a string', function() {
      expect(resultSnippet).to.have.property('data')
        .that.is.a('string');
    });

    it('should have a filePath property that is a string', function() {
      expect(resultSnippet).to.have.property('filePath')
        .that.is.a('string');
    });

    it('should have a name property that is a string', function() {
      expect(resultSnippet).to.have.property('name', 'test.snip')
        .that.is.a('string');
    });

    it('should have a public property that is a boolean and defaulted to true', function() {
      expect(resultSnippet).to.have.property('public', true)
        .that.is.a('boolean');
    });
  });

  describe('updateSnippet', function() {

    let resultSnippet, updateResult, oldSnippet;
    let snippetUpdates = {
      filePath: 'test@chai.com/updates/updatedtest.snip',
      name: 'updatedtest.snip'
    };
    let testSnippet = {
      createdBy: 'test@chai.com',
      data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
      filePath: 'test@chai.com/test.snip',
      name: 'test.snip',
      username: 'test'
    };

    before(function(done) {
      let testUpdateSnippet = function() {
        Snippet.create(testSnippet)
          .then(function(returnedSnippet) {
            oldSnippet = returnedSnippet;
            Snippets.updateSnippetAsync(returnedSnippet._id, snippetUpdates)
              .then(result => {
                updateResult = result;
                Snippet.findOne({ _id: returnedSnippet._id }, function(err, returnedSnippet) {
                  resultSnippet = returnedSnippet;
                  done();
                });
              });
          })
          .catch(function(err) {
            console.log(err);
            done();
          });
      };

      removeTestSnippet(testUpdateSnippet);

    });

    it('should return a results object', function() {
      expect(updateResult).to.be.an('object');
    });

    it('should report updating the document from the database', function() {
      expect(updateResult).to.have.property('n')
        .that.equals(1);
    });

    it('should update properties', function() {
      expect(resultSnippet).to.have.property('filePath', 'test@chai.com/updates/updatedtest.snip')
        .that.is.a('string');
      expect(resultSnippet).to.have.property('name', 'updatedtest.snip')
        .that.is.a('string');
    });

    it('should change the _updatedAt property of the document in the database', function() {
      expect(resultSnippet).to.have.property('_updatedAt')
        .that.is.not.equal(oldSnippet._updatedAt);
    });
  });

  describe('removeSnippet', function() {

    let resultSnippet, deleteResult;
    before(function(done) {
      let testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/test.snip',
        name: 'test.snip',
        username: 'test'
      };

      let testRemoveSnippet = function() {
        Snippet.create(testSnippet)
          .then(function(returnedSnippet) {
            resultSnippet = returnedSnippet;
            Snippet.removeSnippetAsync(returnedSnippet._id)
              .then(result => {
                deleteResult = result;
                done();
              });
          })
          .catch(function(err) {
            console.log(err);
            done();
          });
      };

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

    it('should not be able to find the test snippet', function(done) {
      Snippet.findOne({ _id: resultSnippet._id }, function(err, result) {
        expect(result).to.be.null;
        done();
        if (result) {
          result.remove();
        }
      });
    });
  });

  describe('Folder basics', function() {

    it('should have a makeSubFolder function', function() {
      expect(Snippet.makeSubFolder).to.be.a('function');
    });

    it('should have a makeRootFolder function', function() {
      expect(Snippet.makeRootFolder).to.be.a('function');
    });

    it('should have a removeFolder function', function() {
      expect(Snippet.removeFolder).to.be.a('function');
    });
  });

  describe('makeSubFolder', function() {

  });

  describe('makeRootFolder', function() {

  });

  describe('removeFolder', function() {

  });

  describe('Snippet Getters', function() {

    it('should have a getSnippetsByUser function', function() {
      expect(Snippet.updateSnippetsByUser).to.be.a('function');
    });

    it('should have a updateSnippetsByUser function', function() {
      expect(Snippet.getSnippetsByUser).to.be.a('function');
    });

    it('should have a getSnippetsByFolder function', function() {
      expect(Snippet.getSnippetsByFolder).to.be.a('function');
    });
  });
});

// //////////////////////////////////////////////////////////
// //                   Auth Routes                        //
// //////////////////////////////////////////////////////////

describe('Auth Routes', function() {

  let request = require('supertest');
  let express = require('express');
  let testApp = express();
  let Routes = require('../user-server/config/routes.js')(testApp, express);
  let config = require('../setup.js');
  let userController = require('../user-server/controllers/userController');

  describe('Auth basics', function() {
    it('should have signin function', function() {
      expect(userController.signin).to.be.a('function');
    });

    it('should have getSnippet function', function() {
      expect(userController.signup).to.be.a('function');
    });

    it('should have githubLogin function', function() {
      expect(userController.githubLogin).to.be.a('function');
    });

    it('should have a userInfo function', function() {
      expect(userController.userInfo).to.be.a('function');
    });

    it('should have a updateUserInfo function', function() {
      expect(userController.updateUserInfo).to.be.a('function');
    });
  });

  describe('basic', function() {

    it('should have a /user/signup route', function(done) {
      request(testApp)
        .post('/user/signup')
        .send({ email: 'test@chai.com', username: 'test', password: 'test' })
        .expect(500)
        .end(function(err, res) {
          console.log(res.body);
          console.log(err);
          if (err) {
            done();
          } else {
            expect(err).to.be.instanceOf(Error);
            done();
          }
        });
    });

    it('should have a /user/signin route', function() {
      request(testApp)
        .post('/user/signin')
        .send({ email: 'test@chai.com', password: 'test' })
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.body).to.equal('Unathorized');
            done();
          }
        });
    });
  });

  describe('/user/signup', function() {

    it('should be able to sign up a test user and be returned a token', function(done) {
      request(testApp)
        .post('/user/signup')
        .send({ email: 'test@chai.com', username: 'test', password: 'test' })
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status);
            expect(res.msg).to.be.a('string');
            that.has.value('Authorized');
            done();
          }
        });
    });

    it('should not be able to sign up with the same email', function(done) {
      request(testApp)
        .post('/user/signup')
        .send({ email: 'test@chai.com', password: 'test' })
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status);
            expect(res.msg).to.be.a('string');
            that.has.value('Authorized');
            done();
          }
        });
    });
  });

  describe('/user/signin', function() {

    it('should be able to sign in with appropriate credentials and recieve a token', function(done) {
      request(testApp)
        .post('/user/signin')
        .send({ email: 'test@chai.com', password: 'test' })
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status);
            expect(res.msg).to.be.a('string');
            that.has.value('Authorized');
            done();
          }
        });
    });

    it('should not be able to sign in with inappropriate credentials', function(done) {
      request(testApp)
        .post('/user/signin')
        .send({ email: 'test@chai.com', password: 'test' })
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            expect(res.status);
            expect(res.msg).to.be.a('string');
            that.has.value('Authorized');
            done();
          }
        });
    });

  });

  describe('/user/api/userInfo', function() {

    it('should not be able to get user info without a token', function(done) {

    });

    it('should be able to get user info with a token', function(done) {

    });

  });

});

// //////////////////////////////////////////////////////////
// //                   Snippet Routes                     //
// //////////////////////////////////////////////////////////

// describe('Snippet Routes', function() {

//   describe('/files/api/snippets', function() {

//     describe('Unauthorized', function() {

//       it('it should not be able to post a snippet without a token', function(done) {

//       });

//       it('it should not be able to get a private snippet without a token', function(done) {

//       });

//       it('it should be able to get a public snippet without a token', function(done) {

//       });

//       it('it should not be able to update a snippet without a token', function(done) {

//       });

//       it('it should not be able to delete a snippet without a token', function(done) {

//       });

//     });

//     describe('Authorized', function() {

//       it('it should be able to post a snippet when it has a token', function(done) {

//       });

//       it('it should be able to get a private snippet when it has a token', function(done) {

//       });

//       it('it should be able to update a snippet when it has a token', function(done) {

//       });

//       it('it should be able to delete a snippet when it has a token', function(done) {

//       });

//     });

//   });

//   describe('/files/api/user/snippets', function() {

//     describe('Unauthorized', function() {

//       it('should return 401 for a get request without a token', function(done) {

//       });

//     });

//     describe('Authorized', function() {

//       it('should return 201 and an array of snippets for a get request with a token', function(done) {

//       });

//       it('should return 404 and an emptry array for a user with no snippets', function(done) {

//       });

//     });

//   });

//   describe('/files/api/folders', function() {

//     describe('Unauthorized', function() {

//     });

//     describe('Authorized', function() {

//     });

//   });

//   describe;

// });
