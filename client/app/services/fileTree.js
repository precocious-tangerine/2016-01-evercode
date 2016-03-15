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
let insertIntoTreeRoot = (tree, filePathArrReverse, filePathAttr) => {
  if(filePathArrReverse.length !== 0) {
    let currValue = filePathArrReverse.pop();
    let nextValue = filePathArrReverse[filePathArrReverse.length -1];
    tree.value = tree.value ? tree.value : currValue;
    let childNode = tree.findChild(nextValue);
    let newFilePath = filePathAttr + tree.value + '/';
    if(childNode === undefined && typeof tree.value === 'string') {
      childNode = new Tree(null, newFilePath);
      tree.children.push(childNode);
      childNode.parent = tree;
    }
    insertIntoTreeRoot(childNode, filePathArrReverse, newFilePath);
  }
}


let convertToTree = function(snippetObj) {
  let keyValues = R.toPairs(snippetObj);
  let filePaths = keyValues.map( (keyValue) => {
    let folders = keyValue[0].split('/'); 
    folders[folders.length - 1] = keyValue[1];
    return R.reverse(folders);
  });
  let userTree = new Tree(null);
  filePaths.forEach( (filePath) => insertIntoTreeRoot(userTree, filePath, '') );
  return userTree;
};

export default convertToTree;

