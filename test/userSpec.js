'use strict';
require('babel-polyfill');
let expect = require('chai').expect;
let mongoose = require('mongoose');
let Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1/everCodeTest');
let User = require('../user-server/models/users');
let Snippet = require('../files-server/models/snippets');
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
        _password: 'just testing',
        username: 'test'
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
        _password: 'just testing',
        username: 'test'
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
      _password: 'just testing',
      username: 'test'
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
        _password: 'just testing',
        username: 'test'
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