'use strict';
let mongoose = require('mongoose');
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

let Snippet = mongoose.model('Snippet', snippetSchema);

Snippet.makeSnippet = (snippetObj, callback) => {
  Snippet.findOne({filePath: snippetObj.filePath})
  .then(result => {
    if(!result) {
      Snippet.create(snippetObj)
        .then((result) => callback(null, result))
        .catch(callback);
    } else {
      callback(null, result);
    }
  });
};

Snippet.getSnippet = (_id, callback) => {
  Snippet.findOne({ _id: mongoose.Types.ObjectId(_id) })
    .then(snippetObj => callback(null, snippetObj))
    .catch(callback);
};

Snippet.updateSnippet = (_id, newProps, callback) => {
  newProps._updatedAt = new Date();
  Snippet.update({ _id: mongoose.Types.ObjectId(_id) }, newProps, { multi: false }, callback);
};

Snippet.removeSnippet = (_id, callback) => {
  Snippet.findOne({ _id: mongoose.Types.ObjectId(_id) }).remove(callback);
};

Snippet.getSnippetsByUser = (email, callback) => {
  Snippet.find({ createdBy: email })
    .then((foundSnippets) => {
      if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
        callback(null, foundSnippets);
      } else {
        callback(new Error('no snippets found'), null);
      }
    })
    .catch(callback);
};

Snippet.updateSnippetsByUser = (email, newProps, callback) => {
  newProps._updatedAt = new Date();
  Snippet.update({ createdBy: email }, newProps, {multi: true}, callback);
};

Snippet.getSnippetsByFolder = (email, folder, callback) => {
  Snippet.find({ createdBy: email, filePath: new RegExp(folder + '.*', 'igm') })
    .then((foundSnippets) => {
      if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
        callback(null, foundSnippets);
      } else {
        callback(new Error('password invalid'), null);
      }
    }).catch(callback);
};

Snippet.makeSubFolder = (email, username, filepath, callback) => {
  filepath = (filepath.charAt(0) !== '/') ? '/' + filepath : filepath;
  Snippet.makeSnippet({ name: '.config', data: '..', createdBy: email, username: username, filePath: filepath + '/.config' }, callback);
};

Snippet.makeRootFolder = (email, username, callback) => {
  Snippet.makeSnippet({ name: '.config', data: '..', createdBy: email, username: username, filePath: '/' + email + '/.config' }, callback);
};

Snippet.removeFolder = (email, folder, callback) => {
  Snippet.getSnippetsByFolder(email, folder, (err, snippets) => {
    if (err) {
      callback(err);
    } else {
      var removeSnippetAsync = Promise.promisify(Snippet.removeSnippet);
      var promiseArray = snippets.map(snip => removeSnippetAsync(snip._id));
      Promise.all(promiseArray)
        .then(response => {
          callback(null, response);
        })
        .catch(callback);
    }
  });
};

//TODO figure out how to return only 25
Snippet.getPublic = (callback) => {
  Snippet.find({ public: 1, name: { $ne: '.config' } })
    .then((foundSnippets) => {
      callback(null, foundSnippets.sort({ _createdAt: -1 }));
    }).catch(callback);
};


module.exports = Snippet;