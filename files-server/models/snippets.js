'use strict';
let mongoose = require('mongoose');
let setup = require('../../setup.js');
let db = mongoose.createConnection(setup.mongodbHost + setup.mongodbPort + setup.mongodbFilesName);

let Promise = require('bluebird');

let snippetSchema = mongoose.Schema({
  _createdAt: { type: Date, default: new Date() },
  _updatedAt: { type: Date, default: new Date() },
  createdBy: { type: String, required: true },
  username: { type: String, required: true },
  data: { type: String, default: '' },
  name: { type: String, required: true },
  filePath: { type: String, required: true },
  tags: { type: [String], default: [] },
  annotation: { type: String },
  description: { type: String },
  public: { type: Boolean, default: true },
  favorite: { type: Boolean, default: false },
  shortcut: { type: String },
  language: { type: String, default: 'javascript' }
});

let snippetStatics = {
  makeSnippet(snippetObj, callback) {
    this.findOne({filePath: snippetObj.filePath})
    .then(result => {
      if (!result) {
        this.create(snippetObj)
        .then((result) => callback(null, result))
        .catch(callback);
      } else {
        callback(null, result);
      }
    });
  },

  getSnippet(_id, callback) {
    this.findOne({_id: mongoose.Types.ObjectId(_id)})
    .then(snippetObj => callback(null, snippetObj))
    .catch(callback);
  },

  updateSnippet(_id, newProps, callback) {
    newProps._updatedAt = new Date();
    this.update({ _id: mongoose.Types.ObjectId(_id) }, newProps, { multi: false }, callback);
  },

  removeSnippet(_id, callback) {
    this.findOne({ _id: mongoose.Types.ObjectId(_id) }).remove(callback);
  },

  getSnippetsByUser(email, callback) {
    this.find({ createdBy: email })
    .then((foundSnippets) => {
      if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
        callback(null, foundSnippets);
      } else {
        callback(new Error('no snippets found'), null);
      }
    })
    .catch(callback);
  },

  updateSnippetsByUser(email, newProps, callback) {
    newProps._updatedAt = new Date();
    this.update({ createdBy: email }, newProps, {multi: true}, callback);
  },

  getSnippetsByFolder(email, folder, callback) {
    this.find({ createdBy: email, filePath: new RegExp(folder + '.*', 'igm') })
      .then((foundSnippets) => {
        if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
          callback(null, foundSnippets);
        } else {
          callback(new Error('password invalid'), null);
        }
      }).catch(callback);
  },

  makeSubFolder(email, username, filepath, callback) {
    filepath = (filepath.charAt(0) !== '/') ? '/' + filepath : filepath;
    this.makeSnippet({ name: '.config', data: '..', createdBy: email, username: username, filePath: filepath + '/.config' }, callback);
  },

  makeRootFolder(email, username, callback) {
    this.makeSnippet({ name: '.config', data: '..', createdBy: email, username: username, filePath: '/' + email + '/.config' }, callback);
  },

  removeFolder(email, folder, callback) {
    this.getSnippetsByFolder(email, folder, (err, snippets) => {
      if (err) {
        callback(err);
      } else {
        let removeSnippetAsync = Promise.promisify(this.removeSnippet.bind(this));
        let promiseArray = snippets.map(snip => removeSnippetAsync(snip._id));
        Promise.all(promiseArray)
        .then(response => {
          callback(null, response);
        })
        .catch(callback);
      }
    });
  },

  getPublic(page, callback) {
    page = page || 0;
    this.find({ public: 1, name: { $ne: '.config' } },{}, {limit:24 , skip: 24 * page})
      .then((foundSnippets) => {
        callback(null, foundSnippets.sort({ _createdAt: -1 }));
      })
      .catch(callback);
  }
};

let snippetStaticsAsync = Promise.promisifyAll(snippetStatics);

Object.assign(snippetSchema.statics, snippetStaticsAsync);
let Snippet = db.model('Snippet', snippetSchema);

module.exports = Snippet;
