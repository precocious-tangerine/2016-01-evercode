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
  xit('should have a snippet object', function(){
    expect(resultUser).to.have.property('snippets')
      .that.is.an('object')
  });
  xit('should have a root folder in the snippets object', function(){
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

describe('the User Model - getUser', function () {

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

describe('the User Model - updateUser', function () {

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

describe('the User Model - removeUser', function () {

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

describe('the Snippet Model - Snippet basics', function () {
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

describe('the Snippet Model - makeSnippet', function (){

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

describe('the Snippet Model - getSnippet', function (){

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

describe('the Snippet Model - updateSnippet', function (){

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

describe('the Snippet Model - removeSnippet', function (){

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

describe('the Snippet Model - Folder basics', function () {

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

describe('the Snippet Model - makeSubFolder', function (){

})

describe('the Snippet Model - makeRootFolder', function (){

})

describe('the Snippet Model - removeFolder', function (){

})

describe('the Snippet Model - Snippet Getters', function(){

  it('should have a getSnippetByFilepath function', function(){
    expect(Snippet.getSnippetByFilepath).to.be.a('function');
  })

  it('should have a getSnippetsByUser function', function(){
    expect(Snippet.getSnippetsByUser).to.be.a('function');
  })

  xit('should have a getSnippetInfoByUser function', function(){
    expect(Snippet.getSnippetInfoByUser).to.be.a('function');
  })

  xit('should have a getSnippetInfoByFolder function', function(){
    expect(Snippet.getSnippetInfoByFolder).to.be.a('function');
  })

  it('should have a getSnippetsByFolder function', function(){
    expect(Snippet.getSnippetsByFolder).to.be.a('function');
  })
})

//////////////////////////////////////////////////////////
//                 Annotations Model                    //
//////////////////////////////////////////////////////////

var Annotation = require('../server/models/annotations');

var removeTestAnnotation = function(callback){
  Annotation.findOne({data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations'}, function(err, result) {
    if (result) {
      result.remove(callback);
    } else {
      callback();
    }
  });
}

var removeTestAnnotations = function(callback){
  Annotation.find({data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations'}, function(err, results) {
    if (Array.isArray(results) && results.length > 0) {
      results.forEach(function(doc){
        doc.remove();
      });
      callback();
    } else {
      callback();
    }
  });
}

var testSnippet = {
  createdBy: 'test@chai.com',
  data: 'I am the test Snippet, made by Edison Huff, and I stand alone in this world of snippets',
  filePath: 'test@chai.com/test.snip',
  name: 'test.snip'
};

var testAnnotationSnippet;

Snippet.create(testSnippet)
  .then(function(returnedSnippet) {
    testAnnotationSnippet = returnedSnippet;
  })
  .catch(function(err){
    done()
  });


describe('the Annotation Model - Annotation basics', function () {

  it('should have makeAnnotation function', function () {
    expect(Annotation.makeAnnotation).to.be.a('function');
  });

  it('should have getAnnotation function', function () {
    expect(Annotation.getAnnotation).to.be.a('function');
  });

  it('should have updateAnnotation function', function () {
    expect(Annotation.updateAnnotation).to.be.a('function');
  });

  it('should have a removeAnnotation function', function () {
    expect(Annotation.removeAnnotation).to.be.a('function');
  });

  it('should have a getBySnippet function', function () {
    expect(Annotation.getBySnippet).to.be.a('function');
  });

  it('should have a removeBySnippet function', function () {
    expect(Annotation.removeBySnippet).to.be.a('function');
  });  
});

describe('the Annotation Model - makeAnnotation', function (){

  var resultAnnotation;
  before(function(done) {

    var testAnnotation = {
      _sid: testAnnotationSnippet._id +'',
      _createdBy: 'test@chai.com',
      data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations',
      start: 0,
      end: 1,
    };

    var testMakeAnnotation = function() {
      Annotation.makeAnnotation(testAnnotation, function(err, returnedAnnotation) {
        resultAnnotation = returnedAnnotation;
        done();
        returnedAnnotation.remove();
      });
    }

    removeTestAnnotation(testMakeAnnotation);
  });


  it('should return an object', function() {
    expect(resultAnnotation).to.be.an('object');
  });

  it('should have a unique id called _id', function() {
    expect(resultAnnotation).to.have.property('_id');
  });

  it('should have a unique id called _sid that is a String', function() {
    expect(resultAnnotation).to.have.property('_sid')
      .that.is.a('string');
  });

  it('should have a property called _createdAt that is a Date', function() {
    expect(resultAnnotation).to.have.property('_createdAt');
  });

  it('should have a property called _updatedAt At that is a Date', function() {
    expect(resultAnnotation).to.have.property('_updatedAt');
  });
  
  it('should have a property called _createdBy is a string', function () {
    expect(resultAnnotation).to.have.property('_createdBy', 'test@chai.com')
      .that.is.a('string');
  });

  it('should have a data property that is a string', function () {
    expect(resultAnnotation).to.have.property('data')
      .that.is.a('string');
  });

  it('should have a start property that is a number', function () {
    expect(resultAnnotation).to.have.property('start')
      .that.is.a('number');
  });

  it('should have an end property that is a number', function () {
    expect(resultAnnotation).to.have.property('end')
      .that.is.a('number');
  });
})

describe('the Annotation Model - getAnnotation', function (){
  var resultAnnotation;
  before(function(done) {
    var testAnnotation = {
      _sid: testAnnotationSnippet._id +'',
      _createdBy: 'test@chai.com',
      data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations',
      start: 0,
      end: 1,
    };

    var testGetAnnotation = function() {
      Annotation.create(testAnnotation)
        .then(function(returnedAnnotation) {
          testAnnotation = returnedAnnotation;
          Annotation.getAnnotation(testAnnotation._id ,function(err, result) {
            resultAnnotation = result;
            done();
          })
        })
        .catch(function(err){
          done()
        }) 
    }

    removeTestAnnotation(testGetAnnotation);
  });


    it('should return an object', function() {
    expect(resultAnnotation).to.be.an('object');
  });

  it('should have a unique id called _id', function() {
    expect(resultAnnotation).to.have.property('_id');
  });

  it('should have a unique id called _sid that is a String', function() {
    expect(resultAnnotation).to.have.property('_sid')
      .that.is.a('string');
  });

  it('should have a property called _createdAt that is a Date', function() {
    expect(resultAnnotation).to.have.property('_createdAt');
  });

  it('should have a property called _updatedAt At that is a Date', function() {
    expect(resultAnnotation).to.have.property('_updatedAt');
  });
  
  it('should have a property called _createdBy is a string', function () {
    expect(resultAnnotation).to.have.property('_createdBy', 'test@chai.com')
      .that.is.a('string');
  });

  it('should have a data property that is a string', function () {
    expect(resultAnnotation).to.have.property('data')
      .that.is.a('string');
  });

  it('should have a start property that is a number', function () {
    expect(resultAnnotation).to.have.property('start')
      .that.is.a('number');
  });

  it('should have an end property that is a number', function () {
    expect(resultAnnotation).to.have.property('end')
      .that.is.a('number');
  });
})

describe('the Annotation Model - updateAnnotation', function (){

  var resultAnnotation;
  var updateResult;
  var oldAnnotation;
  var annotationUpdates = {
    _createdBy: 'update@update.update',
    start: 42,
    end: 1337
  }


  before(function(done) {
    var testAnnotation = {
        _sid: testAnnotationSnippet._id +'',
        _createdBy: 'test@chai.com',
        data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations',
        start: 0,
        end: 1,
    };

    var testUpdateAnnotation = function () {
      Annotation.create(testAnnotation)
      .then(function(returnedAnnotation) {
        oldAnnotation = returnedAnnotation;
        Annotation.updateAnnotation(returnedAnnotation._id, annotationUpdates ,function(err, result) {
          updateResult = result;
          Annotation.findOne({_id: returnedAnnotation._id}, function(err, returnedAnnotation) {
            resultAnnotation = returnedAnnotation;
            done();
          })
        });
      })
      .catch(function(err){
        console.log(err);
        done()
      }) 
    }

    removeTestAnnotation(testUpdateAnnotation);
    
  });
  
  it('should return a results object', function() {
    expect(updateResult).to.be.an('object');
  });

  it('should report updating the document from the database', function() {
    expect(updateResult).to.have.property('n')
      .that.equals(1);
  });
  
  it('should update properties', function () {
    expect(resultAnnotation).to.have.property('_createdBy','update@update.update')
      .that.is.a('string');
    expect(resultAnnotation).to.have.property('start', 42)
      .that.is.a('number');
    expect(resultAnnotation).to.have.property('end', 1337)
      .that.is.a('number');
  });

  it('should change the _updatedAt property of the document in the database', function() {
    expect(resultAnnotation).to.have.property('_updatedAt')
      .that.is.not.equal(oldAnnotation._updatedAt);
  });
})

describe('the Annotation Model - removeAnnotation', function (){

  var resultAnnotation;
  var deleteResult;
  before(function(done) {
    var testAnnotation = {
      _sid: testAnnotationSnippet._id +'',
      _createdBy: 'test@chai.com',
      data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations',
      start: 0,
      end: 1,
    };

    var testRemoveAnnotation = function () {
      Annotation.create(testAnnotation)
      .then(function(returnedAnnotation){
        resultAnnotation = returnedAnnotation;
        Annotation.removeAnnotation(returnedAnnotation._id ,function(err, result) {
          deleteResult = result;
          done();
        })
      })
      .catch(function(err){
        console.log(err);
        done()
      })
    }

    removeTestAnnotation(testRemoveAnnotation);

  });

  it('should return a results object', function() {
    expect(deleteResult.result).to.be.an('object')
      .that.has.property('ok');
  });

  it('should report removal from the database', function() {
    expect(deleteResult.result).to.have.property('n')
      .that.equals(1);
  });
  
  it('should not be able to find the test annotation', function (done) {
    Annotation.findOne({_id: resultAnnotation._id}, function(err, result) {
      expect(result).to.be.null;
      done();
      if (result) {
        result.remove();
      }
    });
  });
})

describe('the Annotation Model - getBySnippet', function (){
  var resultAnnotations;
  var testAnnotations = [];

  before(function(done) {
    testAnnotations.push({
      _sid: testAnnotationSnippet._id +'',
      _createdBy: 'test@chai.com',
      data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations',
      start: 0,
      end: 1,
    });

    var testGetBySnippet = function() {
      Annotation.create(testAnnotations[0])
        .then(function(returnedAnnotation) {
          testAnnotations.push(returnedAnnotation);
        })
        .then(function(){
          return Annotation.create(testAnnotations[0])
        })
        .then(function(returnedAnnotation2){
          testAnnotations.push(returnedAnnotation2);
        })
        .then(function(){
          Annotation.getBySnippet(testAnnotationSnippet._id ,function(err, result) {
            resultAnnotations = result;
            done();
          })
        })
        .catch(function(err){
          done()
        });
    }

    removeTestAnnotations(testGetBySnippet);
  });

  it('should return an array of annotations', function(){
    expect(resultAnnotations).to.be.instanceOf(Array)
      .and.have.length(2);
  });

  it('should return an array where each element has the same _sid', function(){
    resultAnnotations.forEach(function(document){
      expect(document).to.have.property('_sid')
        .that.is.a('string')
        .and.equals(testAnnotationSnippet.id + '');
    })
  })
})

describe('the Annotation Model - removeBySnippet', function () {
  var deleteResult;
  var testAnnotations = [];
  before(function(done) {
    testAnnotations.push({
      _sid: testAnnotationSnippet._id +'',
      _createdBy: 'test@chai.com',
      data: 'I am the test Annotation, made by Edison Huff, and I stand alone in this world of annotations',
      start: 0,
      end: 1,
    });

    var testRemoveAnnotation = function () {
      Annotation.create(testAnnotations[0])
      .then(function(returnedAnnotation){
        testAnnotations.push(returnedAnnotation);
      })
      .then(function(){
        return Annotation.create(testAnnotations[0])
      })
      .then(function(returnedAnnotation2) {
        testAnnotations.push(returnedAnnotation2);
      })
      .then(function(){
        Annotation.removeBySnippet(testAnnotationSnippet._id ,function(err, result) {
          deleteResult = result;
          done();
        })
      })
      .catch(function(err){
        console.log(err);
        done()
      })
    }

    removeTestAnnotations(testRemoveAnnotation);

  });

  it('should return a results object', function() {
    expect(deleteResult.result).to.be.an('object')
      .that.has.property('ok');
  });

  it('should report removal from the database', function() {
    expect(deleteResult.result).to.have.property('n')
      .that.equals(2);
  });
  
  it('should not be able to find the test annotations', function (done) {
    Annotation.find({_sid: testAnnotationSnippet._id}, function(err, result) {
      expect(result).to.be.instanceOf(Array)
        .and.have.length(0);
      done();
      if (result) {
        result.forEach(function(doc) {
          doc.remove();
        });
      }
    });
  });
});

//////////////////////////////////////////////////////////
//                   User Routes                        //
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//                   Snippet Routes                     //
//////////////////////////////////////////////////////////