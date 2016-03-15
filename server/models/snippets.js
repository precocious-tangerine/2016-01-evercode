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
	return Snippet.create(snippetObj)
	  .then((result)=> {
	  	return callback(null, result);
	  })
	  .catch((err) => {
	  	console.log("Error:", err);
	  	return callback(err, null);
	  })
}

Snippet.getSnippet = (_id, callback) => {
	return Snippet.findOne({_id: mongoose.Types.ObjectId(_id)})
		.then((snippetObj) => {
		 	callback(null, snippetObj);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return callback(err, null);
		});
}

Snippet.getSnippetByFilepath = (email, filepath, callback) => {
	return Snippet.findOne({email: email, fillePath: filepath})
		.then((snippetObj) => {
		 	return callback(null, snippetObj);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return callback(err, null);
		});
}

Snippet.getSnippetsByUser = (email, callback) => {
	return Snippet.find({createdBy: email})
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			 	return;
			}
			return callback({message: 'snippets for ' + email + ' not found.'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return
		});
}

Snippet.getSnippetInfoByUser = (email, callback) => {
	return Snippet.find({createdBy: email}, '-data')
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			 	return;
			}
			return callback({message: 'you have no files'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return
		});
}

Snippet.getSnippetInfoByFolder = (email, folder, callback) => {
	return Snippet.find({email: email, filePath: folder + /.+/igm}, '-data')
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			 	return;
			}
			return callback({message: 'password invalid'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return
		});
}

Snippet.getSnippetsByFolder = (email, folder, callback) => {
	return Snippet.find({email: email, filePath: folder + /.+/igm})
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(null, foundSnippets);
			 	return;
			}
			return callback({message: 'password invalid'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return
		});
}

Snippet.updateSnippet = (_id, newProps, callback) => {
  newProps._updatedAt = new Date();
  return Snippet.update({_id: mongoose.Types.ObjectId(_id)}, newProps, { multi: false } , (err, raw) => {
  		if (raw) {
      		callback(null, raw);
  		} else {
  			callback(err, null);
  		}
    });
}

Snippet.makeSubFolder = (email, filepath, callback) => {
	return Snippet.makeSnippet({name:'.config', data:'..', createdBy: email, filePath: filepath + "/"}, 
		(snippet) => {
			return callback(null ,snippet)
		});
}

Snippet.makeRootFolder = (email, callback) => {
	return Snippet.makeSnippet({name:'.config', data:'..', createdBy: email, filePath: email + "/"}, 
		(snippet) => {
			return callback(null ,snippet)
		});
}

Snippet.removeSnippet = (_id, callback) => {
  Snippet.findOne({email: email}).remove(callback);
}


module.exports = Snippet;

