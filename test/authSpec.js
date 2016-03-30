'use strict';
require('babel-polyfill');
let expect = require('chai').expect;
let Promise = require('bluebird');

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