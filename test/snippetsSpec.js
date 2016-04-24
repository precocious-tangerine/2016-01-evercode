'use strict';
require('babel-polyfill');
let expect = require('chai').expect;
let Promise = require('bluebird');
let Snippet = Promise.promisifyAll(require('../files-server/models/snippets'));


let removeTestSnippet = (callback) => {
  Snippet.findOne({ data: 'I am the test Snippet, and I stand alone in this world of snippets' })
    .then(result => {
      if (result) {
        result.remove(callback);
      } else {
        callback();
      }
    })
    .catch(err => {
      console.log(err);
      callback(err);
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
        data: 'I am the test Snippet, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip',
        username: 'test'
      };

      let testMakeSnippet = () => {
        Snippet.makeSnippetAsync(testSnippet)
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
        data: 'I am the test Snippet, and I stand alone in this world of snippets',
        filePath: 'test@chai.com/',
        name: 'test.snip',
        username: 'test'
      };

      let testGetSnippet = () => {
        Snippet.create(testSnippet)
          .then(returnedSnippet => {
            testSnippet = returnedSnippet;
            Snippet.getSnippetAsync(testSnippet._id)
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
      data: 'I am the test Snippet, and I stand alone in this world of snippets',
      filePath: 'test@chai.com/test.snip',
      name: 'test.snip',
      username: 'test'
    };

    before(done => {
      let testUpdateSnippet = () => {
        Snippet.create(testSnippet)
          .then(returnedSnippet => {
            oldSnippet = returnedSnippet;
            Snippet.updateSnippetAsync(returnedSnippet._id, snippetUpdates)
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
        data: 'I am the test Snippet, and I stand alone in this world of snippets',
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
        Snippet.makeRootFolderAsync(email, username)
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
        Snippet.makeSubFolderAsync(email, username, filepath)
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
        Snippet.makeSubFolderAsync(email, username, filepath)
          .then(createdFolder => {
            Snippet.removeFolderAsync(email, filepath)
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
