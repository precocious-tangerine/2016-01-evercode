'use strict';
let mongoose = require('mongoose');
let Promise = require('bluebird');

let snippetSchema = mongoose.Schema({
  _createdAt: { type: Date, default: new Date() },
  _updatedAt: { type: Date, default: new Date() },
  createdBy: { type: String, required: true },
  data: { type: String, required: true },
  name: { type: String, required: true },
  filePath: { type: String, required: true },
  tags: { type: [String], default: ["taggggg"] },
  public: { type: Boolean, default: true },
  favorite: { type: Boolean, default: false },
  shareUrl: { type: String }
});

let Snippet = mongoose.model('Snippet', snippetSchema);

Snippet.makeSnippet = (snippetObj, callback) => {
  Snippet.create(snippetObj)
    .then((result) => callback(null, result))
    .catch(callback);
}

Snippet.getSnippet = (_id, callback) => {
  Snippet.findOne({ _id: mongoose.Types.ObjectId(_id) })
    .then(snippetObj => callback(null, snippetObj))
    .catch(callback);
}

Snippet.updateSnippet = (_id, newProps, callback) => {
  newProps._updatedAt = new Date();
  Snippet.update({ _id: mongoose.Types.ObjectId(_id) }, newProps, { multi: false }, callback);
}

Snippet.removeSnippet = (_id, callback) => {
  Snippet.findOne({ _id: mongoose.Types.ObjectId(_id) }).remove(callback);
}

// Snippet.getSnippetByFilepath = (email, filepath, callback) => {
//   Snippet.findOne({ email, filepath })
//     .then(snippetObj => callback(null, snippetObj))
//     .catch(callback);
// }

Snippet.getSnippetsByUser = (email, callback) => {
  Snippet.find({ createdBy: email })
    .then((foundSnippets) => {
      if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
        callback(null, foundSnippets);
      } else {
        callback(new Error('no e-mails found'), null);
      }
    })
    .catch(callback);
}

// Snippet.getSnippetInfoByUser = (email, callback) => {
//   Snippet.find({ createdBy: email }, '-data')
//     .then((foundSnippets) => {
//       if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
//         callback(null, foundSnippets);
//       } else {
//         callback(new Error('you have no files'), null);
//       }
//     }).catch(callback);
// }

// Snippet.getSnippetInfoByFolder = (email, folder, callback) => {
//   Snippet.find({ email, filePath: folder + /.+/igm }, '-data')
//     .then((foundSnippets) => {
//       if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
//         callback(null, foundSnippets);
//       } else {
//         callback(new Error('password invalid'), null);
//       }
//     }).catch(callback);
// }

Snippet.getSnippetsByFolder = (email, folder, callback) => {
  Snippet.find({ createdBy: email, filePath: new RegExp(folder + '.*', 'igm') })
    .then((foundSnippets) => {
      console.log('======================', foundSnippets);
      if (Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
        callback(null, foundSnippets);
      } else {
        callback(new Error('password invalid'), null);
      }
    }).catch(callback);
}

Snippet.makeSubFolder = (email, filepath, callback) => {
  filepath = (filepath.charAt(0) !== '/') ? '/' + filepath : filepath;
  Snippet.makeSnippet({ name: '.config', data: '..', createdBy: email, filePath: filepath + '/.config' }, callback);
}

Snippet.makeRootFolder = (email, callback) => {
  Snippet.makeSnippet({ name: '.config', data: '..', createdBy: email, filePath: email + '/.config' }, callback);
}

Snippet.removeFolder = (email, folder, callback) => {
  Snippet.getSnippetsByFolder(email, folder, (err, snippets) => {
    if (err) {
      callback(err);
    } else {
      var removeSnippetAsync = Promise.promisify(Snippet.removeSnippet);
      var promiseArray = snippets.map( snip => removeSnippetAsync(snip._id))
      Promise.all(promiseArray)
        .then(response => {
          callback(null, response)
        })
        .catch(callback);
    }
  })
}


module.exports = Snippet;
