'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');
let _ = require('lodash');

let snippetSchema = mongoose.Schema({
	_createdAt: {type: Date, default: new Date()},
  	_updatedAt: {type: Date, default: new Date()},
	createdBy: { type: String, required: true },
	data: {type: String, required: true},
	name: {type: String, required: true},
	filePath: { type: String, required: true},
	labels: { type: mongoose.Schema.Types.Mixed, default: {} },
	shareUrl: { type: String },
});

let Snippet = mongoose.model('Snippet', snippetSchema);

Snippet.makeSnippet = (snippetObj, callback) => {
	Snippet.create(snippetObj)
	  .then((result)=> {
	  	callback(null, result);
	  })
	  .catch(callback);
}

Snippet.getSnippet = (_id, callback) => {
	Snippet.findOne({_id: mongoose.Types.ObjectId(_id)})
		.then((snippetObj) => {
		 	callback(null, snippetObj);
		})
		.catch(callback);
}

Snippet.getSnippetByFilepath = (email, filepath, callback) => {
	Snippet.findOne({email: email, fillePath: filepath})
		.then((snippetObj) => {
		 	callback(null, snippetObj);
		})
		.catch(callback);
}

Snippet.getSnippetsByUser = (email, callback) => {
	Snippet.find({createdBy: email})
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0) {
			 	callback(null, foundSnippets);
			} else {
			  callback(new Error('no e-mails found', null);
			}
		})
		.catch(callback);
}

Snippet.getSnippetInfoByUser = (email, callback) => {
	Snippet.find({createdBy: email}, '-data')
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			} else {
			  callback(new Error('you have no files'), null);
			}
		})
		.catch(callback);
}

Snippet.getSnippetInfoByFolder = (email, folder, callback) => {
	Snippet.find({email: email, filePath: folder + /.+/igm}, '-data')
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			} else {
				callback(new Error('password invalid'), null);
			}
		})
		.catch(callback);
}

Snippet.getSnippetsByFolder = (email, folder, callback) => {
	Snippet.find({email: email, filePath: folder + /.+/igm})
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			} else {
			callback({message: 'password invalid'}, null);
			}
		})
		.catch(callback);
}

Snippet.updateSnippet = (_id, newProps, callback) => {
  newProps._updatedAt = new Date();
  Snippet.update({_id: mongoose.Types.ObjectId(_id)}, newProps, { multi: false } , (err, raw) => {
  		if (raw) {
      	callback(null, raw);
  		} else {
  			callback(err, null);
  		}
    });
}

Snippet.makeSubFolder = (email, filepath, callback) => {
	Snippet.makeSnippet({name:'.config', data:'..', createdBy: email, filePath: filepath + "/"}, 
		(err, snippet) => {
			if(err) {
				callback(err, null);
			} else {
				callback(null ,snippet);
			}
		});
}

Snippet.makeRootFolder = (email, callback) => {
	Snippet.makeSnippet({name:'.config', data:'..', createdBy: email, filePath: email + "/"}, 
		(err, snippet) => {
			if(err) {
				callback(err, null);
			} else {
				callback(null ,snippet);
			}
		});
}

Snippet.removeSnippet = (_id, callback) => {
  Snippet.findOne({email: email}).remove(callback);
}


module.exports = Snippet;

