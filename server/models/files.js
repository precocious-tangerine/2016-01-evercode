'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');
let _ = require('lodash');

let fileSchema = mongoose.Schema({
	data: {type: String, required: true},
	createdBy: { type: String, required: true },
	filePath: { type: String },
	labels: { type: Schema.Types.Mixed, default: {} }
	shareUrl: { type: String },
});

let File = mongoose.model('File',fileSchema);

File.getFile(_id, callback){
	return File.findOne({_id: new ObjectId(_id)}).exec()
		.then((fileObj) => {
		 	callback(fileObj);
		})
		.catch((err) => {
		 	console.log("error", err);
		});
}

File.getFileByUser(user_Id, callback){
	return File.find({createdBy: nuser_Id}).exec()
		.then((foundFiles) => {
			if(Array.isArray(foundFiles) && foundFiles.length !== 0){
			 	callback(fileObj);
			 	return
			}
			callback({message: 'password invalid'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		});
}

module.exports = File;

