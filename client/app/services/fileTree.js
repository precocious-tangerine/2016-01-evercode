'use strict';
import R from 'ramda';

class Tree {
  constructor(value, filePathAttr) {
    this.parent = null;
    this.value = value;
    this.children = [];
    this.filePath = filePathAttr || '';
  }
  addParent(value) {
    this.parent = new Tree(value);
  }
  addChild(value) {
    this.children.push(new Tree(value));
  }
  deleteChild(value) {
    this.children = this.children.filter(child => !R.equals(child,value));
  }
  deleteParent() {
    this.parent = null;
  }
  findChild(value) {
    return R.find(R.whereEq({value}), this.children);
  }
}
let insertIntoTreeRoot = (tree, filePathArrReverse, filePathAttr, callback) => {
  if(callback === undefined) {
    callback = () => {};
  }
  if(filePathArrReverse.length !== 0) {
    let currValue = filePathArrReverse.pop();
    let nextValue = filePathArrReverse[filePathArrReverse.length -1];
    tree.value = tree.value ? tree.value : currValue;
    tree.filePath = filePathAttr + '/' + (tree.value.name || tree.value);
    let childNode = tree.findChild(nextValue);
    if(childNode === undefined && typeof tree.value === 'string') {
      childNode = new Tree(null);
      tree.children.push(childNode);
      childNode.parent = tree;
    }
    callback(tree);
    insertIntoTreeRoot(childNode, filePathArrReverse, tree.filePath, callback);
  }
}


let convertToTree = function(snippetObj, callback) {
  let keyValues = R.toPairs(snippetObj);
  let filePaths = keyValues.map( (keyValue) => {
    let folders = keyValue[0].split('/'); 
    folders[folders.length - 1] = keyValue[1];
    return R.reverse(folders);
  });
  let userTree = new Tree(null);
  filePaths.forEach( (filePath) => insertIntoTreeRoot(userTree, filePath, '', callback) );
  return userTree;
};

export default convertToTree;

