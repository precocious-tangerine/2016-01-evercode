'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');

let annotationSchema = mongoose.Schema({
  _createdBy:{type: String},
  _createdAt:{type: Date, default: new Date()},
  _updatedAt:{type: Date, default: new Date()},
  _sid:{type: String, require: true},
  start: {type: Number, min:0},
  end:{type: Number},
  data:{type: String},
});

let Annotation = mongoose.model('Annotation', annotationSchema);

Annotation.makeAnnotation = (annotationObj, callback) => {
  Annotation.create(annotationObj)
    .then(result => callback(null, result))      
    .catch(callback);
}

Annotation.getAnnotation = (_id, callback) => {
  Annotation.findOne({ _id: _id })
    .then((annotationObj) => {
      callback(null, annotationObj);
    })
    .catch(callback);
}

Annotation.updateAnnotation = (_id, newProps, callback) => {
  newProps._updatedAt = new Date();
  Annotation.update({ _id }, newProps, { multi: false }, callback);
}

Annotation.removeAnnotation = (_id, callback) => {
  Annotation.findOne({ _id }).remove(callback);
}

Annotation.getBySnippet = (_sid, callback) => {
  Annotation.find({ _sid: _sid })
    .then((foundAnnotations) => {
      if (Array.isArray(foundAnnotations) && foundAnnotations.length !== 0) {
        callback(null, foundAnnotations);
      } else {
        callback(new Error('no annotations found'), null);
      }
    })
    .catch(callback);
}

Annotation.removeBySnippet = (_sid, callback) => {
  Annotation.remove({ _sid: _sid }, callback);
}

module.exports = User;
