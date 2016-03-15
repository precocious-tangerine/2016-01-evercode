'use strict';
import R from 'ramda';

class Tree {
  constructor(value) {
    this.parent = null;
    this.value = value;
    this.children = [];
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
let insertIntoTreeRoot = (tree, filePathArrReverse) => {
  if(filePathArrReverse.length !== 0) {
    console.log('inside loop');
    let currValue = filePathArrReverse.pop();
    let nextValue = filePathArrReverse[filePathArrReverse.length -1];
    tree.value = tree.value ? tree.value : currValue;
    let childNode = tree.findChild(nextValue);
    if(childNode === undefined && typeof tree.value === 'string') {
      childNode = new Tree(null);
      tree.children.push(childNode);
      childNode.parent = tree;
    }
    insertIntoTreeRoot(childNode, filePathArrReverse)
  }
}


let convertToTree = function(snippetObj) {
  let keyValues = R.toPairs(snippetObj);
  console.log(keyValues);
  let filePaths = keyValues.map( (keyValue) => {
    let folders = keyValue[0].split('/'); 
    folders[folders.length - 1] = keyValue[1];
    return R.reverse(folders);
  });
  let userTree = new Tree(null);
  filePaths.forEach( (filePath) => insertIntoTreeRoot(userTree, filePath) );
  return userTree;
};

export default convertToTree;

