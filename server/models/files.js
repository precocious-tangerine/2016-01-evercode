'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');
let _ = require('lodash');

let fileSchema = mongoose.Schema({
	data: {type: String, required: true},
	createdBy: { type: String, required: true },
	filePath: { type: String, required: true},
	labels: { type: mongoose.Schema.Types.Mixed, default: {} },
	shareUrl: { type: String },
});

let File = mongoose.model('File',fileSchema);

File.makeFile = (fileObj, callback) => {
	return File.create(fileObj)
	  .then((result)=> {
	  	console.log("file Created");
	  	return callback(result);
	  })
	  .catch((err) => {
	  	console.log("Error:", err);
	  })
}

File.getFile = (_id, callback) => {
	return File.findOne({_id: mongoose.Types.ObjectId(_id)})
		.then((fileObj) => {
		 	callback(fileObj);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return null
		});
}

File.getFileByUser = (user_Id, callback) => {
	return File.find({createdBy: user_Id})
		.then((foundFiles) => {
			if(Array.isArray(foundFiles) && foundFiles.length !== 0){
			 	callback(fileObj);
			 	return
			}
			return callback({message: 'password invalid'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return
		});
}

File.updateFile = (_id, callback) => {
	return "not yet";

}

module.exports = File;

