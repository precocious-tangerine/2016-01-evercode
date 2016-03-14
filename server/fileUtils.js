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
    this.children = this.children.filter(child => child !== value);
  }
  deleteParent() {
    this.parent = null;
  }
}


let insertIntoTreeRoot = (tree, filePathArrReverse) => {
  

module.exports = function(snippetObj) {
  


};
