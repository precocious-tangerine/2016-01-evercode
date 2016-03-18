class TreeMap {
  insertNode(filePath, node) {
    let context = this;
    let folders = filePath.split('/').filter(a => a).concat(node);
    return folders.reduce((prevPath, currItem) => {
      if(typeof currItem === 'object') {
        this[prevPath].value = currItem
        return true
      } else {

        let currPath = prevPath + '/' + currItem;
        let parentObj = context[prevPath], currObj = context[currPath];
        if(prevPath && !parentObj) { 
          context[prevPath] = {filePath: prevPath, children: []}
        }
        if(parentObj && parentObj.children.indexOf(currPath) === -1) {
          context[prevPath].children.push(currPath);
        }
        context[currPath] = currObj ? currObj : {children: []};
        context[currPath].parent = prevPath;
        context[currPath].value = currItem;
        context[currPath].filePath = currPath;
        if(this.getRoot.__root === undefined) {
          this.getRoot.__root = currPath;  
        }
        return currPath;
      }         
    }, "");
  }
  getRoot() {
    return this[this.getRoot.__root];
  }
  getParent(filePath) {
    let parentPath = this[filePath].parent
    return this[parentPath];
  }
  getChildren(filePath, hideConfigs) {
    let children = this[filePath].children.map(childPath => this[childPath]);
    if(hideConfigs) {
      return children.filter(child => child.value.name !== '.config');
    } else {
      return children;
    }
  }
  getAllParents(filePath) {
    let results = [], parent = true;
    while (parent = this.getParent(filePath)) {
      results.push(parent);
      filePath = parent.filePath;
    }
    return results;
  }
  getAllChildren(filePath, hideConfigs) {
    let children = this.getChildren(filePath, hideConfigs);
    if(children.length === 0) {
      return [];
    } else {
      return children.reduce((results, child) => {
        let childPath = child.filePath;
        let children = this.getChildren(childPath, hideConfigs);
        return results.concat(child, children);  
      }, []);
    }
  }
  deleteNode(filePath) {
    let childrenPaths = this.getAllChildren(filePath).map(child => child.filePath);
    let parent = this.getParent(filePath);
    childrenPaths.forEach(childPath => {
      delete this[childPath];
    });
    parent.children = parent.children.filter(childPath => childPath !== filePath);
  }
}

let convertToTree = function(snippetObj) {
  let userTreeMap = new TreeMap();
  Object.keys(snippetObj).forEach((key) => {
    userTreeMap.insertNode(key, snippetObj[key]);
  })
  return userTreeMap
}


export default convertToTree;
