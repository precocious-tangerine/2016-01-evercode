import R from 'ramda'

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
    return R.find(R.equals(value), this.children);
}


let insertIntoTreeRoot = (tree, filePathArrReverse) => {
  if(filePathArrReverse.length !== 0) {
    let currValue = filePathArrReverse.pop();
    let nextValue = filePathArrReverse[fileTree.length -1];
    this.value ? this.value : currValue;
    let childNode = tree.findChild(nextValue) || new Tree(null);
    insertIntoTreeRoot(childNode, filePathArrReverse)
  }
}


module.exports = function(snippetObj) {
  


};
