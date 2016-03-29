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

let removeTestUser = (callback) => {
  User.findOne({ email: 'test@chai.com' })
    .then(result => {
      if (result) {
        result.remove(callback);
      } else {
        callback();
      }
    })
    .catch(err => {
      console.log(err);
    });
};

describe('the User Model', () => {
  describe('basics', () => {
    it('should have makeUser function', () => {
      expect(User.makeUser).to.be.a('function');
    });

    it('should have getUser function', () => {
      expect(User.getUser).to.be.a('function');
    });

    it('should have updateUser function', () => {
      expect(User.updateUser).to.be.a('function');
    });

    it('should have a removeUser function', () => {
      expect(User.removeUser).to.be.a('function');
    });

    it('should have a checkCredentials helper function', () => {
      expect(User.checkCredentials).to.be.a('function');
    });
  });

  describe('makeUser', () => {
    let resultUser;
    before(done => {
      let testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      let testMakeUser = () => {
        Users.makeUserAsync(testUser)
          .then(returnedUser => {
            resultUser = returnedUser;
            done();
          })
          .catch(err => {
            console.log(err);
          });
      };

      removeTestUser(testMakeUser);
    });

    it('should return an object', () => {
      expect(resultUser).to.be.an('object');
    });

    it('should have a unique id called _id', () => {
      expect(resultUser).to.have.property('_id');
    });

    it('should have an email property that is a string', () => {
      expect(resultUser).to.have.property('email', 'test@chai.com')
        .that.is.a('string');
    });
    it('should have a hashed _password property ', () => {
      expect(resultUser).to.have.property('_password')
        .that.is.a('string')
        .and.not.equal('just testing');
    });
    it('should have a root folder in the snippets db collection', (done) => {
      Snippet.findOne({ createdBy: resultUser.email })
        .then(result => {
          expect(result).to.have.property('createdBy')
            .that.equals(resultUser.email);
          done();
          if (result) {
            result.remove();
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  });

  describe('getUser', () => {

    let resultUser;
    before(done => {
      let testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      let testGetUser = () => {
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
          .catch(err => {
            done();
          });
      };

      removeTestUser(testGetUser);

    });

    it('should return an object', () => {
      expect(resultUser).to.be.an('object');
    });

    it('should have a unique id called _id', () => {
      expect(resultUser).to.have.property('_id');
    });

    it('should have an email property that is a string', () => {
      expect(resultUser).to.have.property('email', 'test@chai.com')
        .that.is.a('string');
    });
    it('should have an _password property', () => {
      expect(resultUser).to.have.property('_password');
    });
  });

  describe('updateUser', () => {

    let resultUser, updateResult;
    let userUpdates = {
      theme: 'twilight',
    };
    let testUser = {
      email: 'test@chai.com',
      _password: 'just testing'
    };

    before(done => {
      let testUpdateUser = () => {
        User.create(testUser)
          .then(returnedUser => {
            testUser = returnedUser;
            Users.updateUserAsync(testUser.email, userUpdates)
              .then(result => {
                updateResult = result;
                User.findOne({ _id: testUser._id })
                  .then(returnedUser => {
                    resultUser = returnedUser;
                    done();
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestUser(testUpdateUser);

    });

    it('should return a results object', () => {
      expect(updateResult).to.be.an('object');
    });

    it('should report updating the document from the database', () => {
      expect(updateResult).to.have.property('n')
        .that.equals(1);
    });

    it('should update properties', () => {
      expect(resultUser).to.have.property('theme')
        .that.is.a('string')
        .and.equal('twilight');
    });
  });

  describe('removeUser', () => {

    let resultUser, deleteResult;
    before(done => {
      let testUser = {
        email: 'test@chai.com',
        _password: 'just testing'
      };

      let testRemoveUser = () => {
        User.create(testUser)
          .then(returnedUser => {
            resultUser = returnedUser;
            Users.removeUserAsync(testUser.email)
              .then(result => {
                deleteResult = result;
                done();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestUser(testRemoveUser);

    });

    it('should return a results object', () => {
      expect(deleteResult.result).to.be.an('object')
        .that.has.property('ok');
    });

    it('should report removal from the database', () => {
      expect(deleteResult.result).to.have.property('n')
        .that.equals(1);
    });

    it('should not be able to find the test user', (done) => {
      User.findOne({ _id: resultUser._id })
        .then(result => {
          expect(result).to.be.null;
          done();
          if (result) {
            result.remove();
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
});

//////////////////////////////////////////////////////////
//                   Snippet Model                      //
//////////////////////////////////////////////////////////
let Snippet = require('../files-server/models/snippets');
let Snippets = Promise.promisifyAll(require('../files-server/models/snippets'));

let removeTestSnippet = (callback) => {
  Snippet.findOne({ data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets' })
    .then(result => {
      if (result) {
        result.remove(callback);
      } else {
        callback();
      }
    })
    .catch(err => {
      console.log(err);
    });
};

describe('the Snippet Model', () => {
  describe('Snippet basics', () => {
    it('should have makeSnippet function', () => {
      expect(Snippet.makeSnippet).to.be.a('function');
    });

    it('should have getSnippet function', () => {
      expect(Snippet.getSnippet).to.be.a('function');
    });

    it('should have updateSnippet function', () => {
      expect(Snippet.updateSnippet).to.be.a('function');
    });

    it('should have a removeSnippet function', () => {
      expect(Snippet.removeSnippet).to.be.a('function');
    });
  });

  describe('makeSnippet', () => {

    let resultSnippet;
    before(done => {

      let testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip',
        username: 'test'
      };

      let testMakeSnippet = () => {
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


    it('should return an object', () => {
      expect(resultSnippet).to.be.an('object');
    });

    it('should have a unique id called _id', () => {
      expect(resultSnippet).to.have.property('_id');
    });

    it('should have a property called _createdAt that is a Date', () => {
      expect(resultSnippet).to.have.property('_createdAt');
    });

    it('should have a property called _updatedAt At that is a Date', () => {
      expect(resultSnippet).to.have.property('_updatedAt');
    });

    it('should have an createdBy property that is a string', () => {
      expect(resultSnippet).to.have.property('createdBy', 'test@chai.com')
        .that.is.a('string');
    });

    it('should have a data property that is a string', () => {
      expect(resultSnippet).to.have.property('data')
        .that.is.a('string');
    });

    it('should have a filePath property that is a string', () => {
      expect(resultSnippet).to.have.property('filePath')
        .that.is.a('string');
    });

    it('should have a name property that is a string', () => {
      expect(resultSnippet).to.have.property('name', 'test.snip')
        .that.is.a('string');
    });

    it('should have a public property that is a boolean and defaulted to true', () => {
      expect(resultSnippet).to.have.property('public', true)
        .that.is.a('boolean');
    });
  });

  describe('getSnippet', () => {

    let resultSnippet;
    before(done => {

      let testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip',
        username: 'test'
      };

      let testGetSnippet = () => {
        Snippet.create(testSnippet)
          .then(returnedSnippet => {
            testSnippet = returnedSnippet;
            Snippets.getSnippetAsync(testSnippet._id)
              .then(result => {
                resultSnippet = result;
                done();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            done();
          });
      };

      removeTestSnippet(testGetSnippet);
    });


    it('should return an object', () => {
      expect(resultSnippet).to.be.an('object');
    });

    it('should have a unique id called _id', () => {
      expect(resultSnippet).to.have.property('_id');
    });

    it('should have an createdBy property that is a string', () => {
      expect(resultSnippet).to.have.property('createdBy', 'test@chai.com')
        .that.is.a('string');
    });

    it('should have a data property that is a string', () => {
      expect(resultSnippet).to.have.property('data')
        .that.is.a('string');
    });

    it('should have a filePath property that is a string', () => {
      expect(resultSnippet).to.have.property('filePath')
        .that.is.a('string');
    });

    it('should have a name property that is a string', () => {
      expect(resultSnippet).to.have.property('name', 'test.snip')
        .that.is.a('string');
    });

    it('should have a public property that is a boolean and defaulted to true', () => {
      expect(resultSnippet).to.have.property('public', true)
        .that.is.a('boolean');
    });
  });

  describe('updateSnippet', () => {

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

    before(done => {
      let testUpdateSnippet = () => {
        Snippet.create(testSnippet)
          .then(returnedSnippet => {
            oldSnippet = returnedSnippet;
            Snippets.updateSnippetAsync(returnedSnippet._id, snippetUpdates)
              .then(result => {
                updateResult = result;
                Snippet.findOne({ _id: returnedSnippet._id })
                  .then(returnedSnippet => {
                    resultSnippet = returnedSnippet;
                    done();
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestSnippet(testUpdateSnippet);

    });

    it('should return a results object', () => {
      expect(updateResult).to.be.an('object');
    });

    it('should report updating the document from the database', () => {
      expect(updateResult).to.have.property('n')
        .that.equals(1);
    });

    it('should update properties', () => {
      expect(resultSnippet).to.have.property('filePath', 'test@chai.com/updates/updatedtest.snip')
        .that.is.a('string');
      expect(resultSnippet).to.have.property('name', 'updatedtest.snip')
        .that.is.a('string');
    });

    it('should change the _updatedAt property of the document in the database', () => {
      expect(resultSnippet).to.have.property('_updatedAt')
        .that.is.not.equal(oldSnippet._updatedAt);
    });
  });

  describe('removeSnippet', () => {

    let resultSnippet, deleteResult;
    before(done => {
      let testSnippet = {
        createdBy: 'test@chai.com',
        data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/test.snip',
        name: 'test.snip',
        username: 'test'
      };

      let testRemoveSnippet = () => {
        Snippet.create(testSnippet)
          .then(returnedSnippet => {
            resultSnippet = returnedSnippet;
            Snippet.removeSnippetAsync(returnedSnippet._id)
              .then(result => {
                deleteResult = result;
                done();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestSnippet(testRemoveSnippet);

    });

    it('should return a results object', () => {
      expect(deleteResult.result).to.be.an('object')
        .that.has.property('ok');
    });

    it('should report removal from the database', () => {
      expect(deleteResult.result).to.have.property('n')
        .that.equals(1);
    });

    it('should not be able to find the test snippet', (done) => {
      Snippet.findOne({ _id: resultSnippet._id })
        .then(result => {
          expect(result).to.be.null;
          done();
          if (result) {
            result.remove();
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  });

  let removeTestFolderSnippet = (callback) => {
    Snippet.find({ email: 'test@chai.com' })
      .then(result => {
        if (Array.isArray(result)) {
          result.forEach(snippet => snippet.remove());
          callback();
        } else {
          callback();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  describe('Folder basics', () => {

    it('should have a makeSubFolder function', () => {
      expect(Snippet.makeSubFolder).to.be.a('function');
    });

    it('should have a makeRootFolder function', () => {
      expect(Snippet.makeRootFolder).to.be.a('function');
    });

    it('should have a removeFolder function', () => {
      expect(Snippet.removeFolder).to.be.a('function');
    });
  });

  describe('makeRootFolder', () => {
    let email = 'test@chai.com';
    let username = 'test';
    let folder;

    before(done => {
      let testMakeRootFolder = () => {
        Snippets.makeRootFolderAsync(email, username)
          .then(createdFolder => {
            folder = createdFolder;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestFolderSnippet(testMakeRootFolder);

    });

    it('should return a folder object', () => {
      expect(folder).to.be.an('object');
    });

    it('should add initial properties', () => {
      expect(folder).to.have.property('filePath', '/test@chai.com/.config')
        .that.is.a('string');
      expect(folder).to.have.property('username', 'test')
        .that.is.a('string');
      expect(folder).to.have.property('favorite', false)
        .that.is.a('boolean');
    });

  });

  describe('makeSubFolder', () => {
    let email = 'test@chai.com';
    let username = 'test';
    let filepath = 'test@chai.com/Test';
    let folder;

    before(done => {
      let testMakeSubFolder = () => {
        Snippets.makeSubFolderAsync(email, username, filepath)
          .then(createdFolder => {
            folder = createdFolder;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestFolderSnippet(testMakeSubFolder);

    });

    it('should return a folder object', () => {
      expect(folder).to.be.an('object');
    });

    it('should have updated filepath', () => {
      expect(folder).to.have.property('filePath', '/test@chai.com/Test/.config')
        .that.is.a('string');
    });

    it('should have other properties unchanged', () => {
      expect(folder).to.have.property('username', 'test')
        .that.is.a('string');
      expect(folder).to.have.property('favorite', false)
        .that.is.a('boolean');
    });
  });

  describe('removeFolder', () => {
    let email = 'test@chai.com';
    let username = 'test';
    let filepath = 'test@chai.com/Test';
    let success, snippet;

    before(done => {
      let testRemoveFolder = () => {
        Snippets.makeSubFolderAsync(email, username, filepath)
          .then(createdFolder => {
            Snippets.removeFolderAsync(email, filepath)
              .then(result => {
                success = result[0].result;
                Snippet.findOne({ filepath: filepath + '/.config' })
                  .then(foundSnippet => {
                    snippet = foundSnippet;
                    done();
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
            done();
          });
      };

      removeTestFolderSnippet(testRemoveFolder);

    });

    it('should return a folder object', () => {
      expect(success).to.be.an('object');
    });

    it('should have updated filepath', () => {
      expect(success).to.have.property('ok', 1)
        .that.is.a('number');
    });

    it('should remove folder snippet from db', () => {
      expect(snippet).to.be.null;
    });
  });

  describe('Snippet Getters', () => {

    it('should have a getSnippetsByUser function', () => {
      expect(Snippet.updateSnippetsByUser).to.be.a('function');
    });

    it('should have a updateSnippetsByUser function', () => {
      expect(Snippet.getSnippetsByUser).to.be.a('function');
    });

    it('should have a getSnippetsByFolder function', () => {
      expect(Snippet.getSnippetsByFolder).to.be.a('function');
    });
  });
});

// //////////////////////////////////////////////////////////
// //                   Auth Routes                        //
// //////////////////////////////////////////////////////////

// describe('Auth Routes', function() {

//   let request = require('supertest');
//   let express = require('express');
//   let testApp = express();
//   let Routes = require('../user-server/config/routes.js')(testApp, express);
//   let config = require('../setup.js');
//   let userController = require('../user-server/controllers/userController');

//   describe('Auth basics', function() {
//     it('should have signin function', function() {
//       expect(userController.signin).to.be.a('function');
//     });

//     it('should have getSnippet function', function() {
//       expect(userController.signup).to.be.a('function');
//     });

//     it('should have githubLogin function', function() {
//       expect(userController.githubLogin).to.be.a('function');
//     });

//     it('should have a userInfo function', function() {
//       expect(userController.userInfo).to.be.a('function');
//     });

//     it('should have a updateUserInfo function', function() {
//       expect(userController.updateUserInfo).to.be.a('function');
//     });
//   });

//   describe('basic', function() {

//     it('should have a /user/signup route', function(done) {
//       request(testApp)
//         .post('/user/signup')
//         .send({ email: 'test@chai.com', username: 'test', password: 'test' })
//         .expect(500)
//         .end(function(err, res) {
//           if (err) {
//             done();
//           } else {
//             expect(err).to.be.instanceOf(Error);
//             done();
//           }
//         });
//     });

//     it('should have a /user/signin route', function() {
//       request(testApp)
//         .post('/user/signin')
//         .send({ email: 'test@chai.com', password: 'test' })
//         .expect(401)
//         .end(function(err, res) {
//           if (err) {
//             done(err);
//           } else {
//             expect(res.body).to.equal('Unathorized');
//             done();
//           }
//         });
//     });
//   });

//   describe('/user/signup', function() {

//     it('should be able to sign up a test user and be returned a token', function(done) {
//       request(testApp)
//         .post('/user/signup')
//         .send({ email: 'test@chai.com', username: 'test', password: 'test' })
//         .expect(201)
//         .end(function(err, res) {
//           if (err) {
//             done(err);
//           } else {
//             expect(res.status);
//             expect(res.msg).to.be.a('string');
//             that.has.value('Authorized');
//             done();
//           }
//         });
//     });

//     it('should not be able to sign up with the same email', function(done) {
//       request(testApp)
//         .post('/user/signup')
//         .send({ email: 'test@chai.com', password: 'test' })
//         .expect(500)
//         .end(function(err, res) {
//           if (err) {
//             done(err);
//           } else {
//             expect(res.status);
//             expect(res.msg).to.be.a('string');
//             that.has.value('Authorized');
//             done();
//           }
//         });
//     });
//   });

//   describe('/user/signin', function() {

//     it('should be able to sign in with appropriate credentials and recieve a token', function(done) {
//       request(testApp)
//         .post('/user/signin')
//         .send({ email: 'test@chai.com', password: 'test' })
//         .expect(500)
//         .end(function(err, res) {
//           if (err) {
//             done(err);
//           } else {
//             expect(res.status);
//             expect(res.msg).to.be.a('string');
//             that.has.value('Authorized');
//             done();
//           }
//         });
//     });

//     it('should not be able to sign in with inappropriate credentials', function(done) {
//       request(testApp)
//         .post('/user/signin')
//         .send({ email: 'test@chai.com', password: 'test' })
//         .expect(500)
//         .end(function(err, res) {
//           if (err) {
//             done(err);
//           } else {
//             expect(res.status);
//             expect(res.msg).to.be.a('string');
//             that.has.value('Authorized');
//             done();
//           }
//         });
//     });

//   });

//   describe('/user/api/userInfo', function() {

//     it('should not be able to get user info without a token', function(done) {

//     });

//     it('should be able to get user info with a token', function(done) {

//     });

//   });

// });

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
