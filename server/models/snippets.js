'use strict';
const Promise = require('bluebird');
var db = require('../db/database');
var _ = require('lodash');

var Snippets = function() {
 this._snippets = {};
};


Snippets.prototype.newSnippetAsync = function (snippet) {
  
}

Snippets.prototype.getSnippetAsync = function (snippetName) {
  
}

Snippets.prototype.updateSnippetAsync = function (snippet) {
 
}

Snippets.prototype.getSnippetsAsync = function(snippetName) {
  
}


module.exports = Snippets;
