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
    this.children = this.children.filter(child => !R.equals(child, value));
  }
  deleteParent() {
    this.parent = null;
  }
  findChild(value) {
    return R.find(R.whereEq({ value }), this.children);
  }
}
let insertIntoTreeRoot = (tree, filePathArrReverse, filePathAttr, callback) => {
  if (callback === undefined) {
    callback = () => {};
  }
  if (filePathArrReverse.length !== 0) {
    let currValue = filePathArrReverse.pop();
    let nextValue = filePathArrReverse[filePathArrReverse.length - 1];
    tree.value = tree.value ? tree.value : currValue;
    tree.filePath = filePathAttr + (tree.value.name || tree.value) + '/';
    let childNode = tree.findChild(nextValue);
    if (childNode === undefined && typeof tree.value === 'string') {
      childNode = new Tree(null);
      tree.children.push(childNode);
      childNode.parent = tree;
    }
    callback(tree);
    insertIntoTreeRoot(childNode, filePathArrReverse, tree.filePath, callback);
  }
}

let convertToTree = function(snippetObj) {
  let keyValues = R.toPairs(snippetObj);
  let filePaths = keyValues.map((keyValue) => {
    let folders = keyValue[0].split('/').filter(a => a);
    folders[folders.length - 1] = keyValue[1];
    return folders;
  });

  let userTreeMap = {};
  Object.defineProperty(userTreeMap, 'insertNode', {
    value: function(filePath, node) {
      let folders = filePath.split('/').filter(a => a);
      folders.reduce((prevPath, currItem) => {
        let currPath = prevPath + '/' + currItem;
        let parentObj = this[prevPath], currObj = this[currPath];
        
        parentObj ? parentObj : {};
        parentObj.children ? parentObj.children.push(currPath) : [currPath];
        parentObj.filePath = prevPath;

        currObj ? currObj : {};
        currObj.parent = parentPath;
        currObj.children = [];
        currObj.value = currItem;
        currObj.filePath = currPath;
        return currPath;         
      });
    }
  });

  filePaths.forEach((filePath) => userTreeMap.insertNode(filePath));
  return userTreeMap
}




  // let userTree = new Tree(null);
  // let userTreeMapCopy = {};
  // filePaths.forEach((filePath) => {
  //   insertIntoTreeRoot(userTree, filePath, '', node => {
  //     userTreeMapCopy[node.filePath] = node;
  //   });
  // })
  // userTreeMapCopy.__root = userTree;
  // let userTreeMap = {};
  // Object.keys(userTreeMapCopy).forEach(key => {
  //   Object.assign(userTreeMap[key] = {}, { value: userTreeMapCopy[key].value, filePath: userTreeMapCopy[key].filePath });
  //   userTreeMap[key].children = userTreeMapCopy[key].children.map(tree => tree.filePath);
  //   userTreeMap[key].parent = userTreeMapCopy[key].parent ? userTreeMapCopy[key].parent.filePath : null;
  // })
  // return userTreeMap;
};

export default convertToTree;
