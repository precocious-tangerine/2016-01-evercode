//The following functions will mutate their arguments

export const insertNode = (tree, filePath, node) => {
    tree = Object.assign({}, tree, {__root: tree.__root});
    let folders = filePath.split('/').filter(a => a).concat(node);
    let allOK = folders.reduce((prevPath, currItem) => {
      if(typeof currItem === 'object') {
        tree[prevPath].value = currItem
        return true
      } else {
        let currPath = prevPath + '/' + currItem;
        let parentObj = tree[prevPath], currObj = tree[currPath];
        if(prevPath && !parentObj) { 
          tree[prevPath] = {filePath: prevPath, children: []}
        }
        if(parentObj && parentObj.children.indexOf(currPath) === -1) {
          tree[prevPath].children.push(currPath);
        }
        tree[currPath] = currObj ? currObj : {children: []};
        tree[currPath].parent = prevPath;
        tree[currPath].value = currItem;
        tree[currPath].filePath = currPath;
        if(tree.__root === undefined) {
          Object.defineProperty(tree, '__root', {
            value: tree[currPath]
          });
        }
        return currPath;
      }         
    }, "");
    return allOK ? tree : throw new Error('Error parsing flepath');
  }

export const deleteNode = (tree, filePath) => {
    tree = Object.assign({}, tree, {__root: tree.__root});
    let childrenPaths = getAllChildren(tree, filePath, true).map(child => child.filePath);
    let parent = getParent(tree, filePath);
    childrenPaths.forEach(childPath => {
      delete tree[childPath];
    });
    parent.children = parent.children.filter(childPath => childPath !== filePath);
    return tree;
  }


//The following functions do not mutate their arguments

export const convertToTree = (snippetObj) => {
  let userTreeMap = Object.keys(snippetObj).reduce( (prevTree, key) => {
    return insertNode(prevTree, key);
  }, {})
  return userTreeMap
}

export let getParent = (tree, filePath) => {
    let parentPath = tree[filePath].parent
    return Object.assign(tree[parentPath]);
  }
export let getChildren = (tree, filePath, showConfigs) => {
    let children = tree[filePath].children.map(childPath => Object.assign({},tree[childPath]));
    if(!showConfigs) {
      return children.filter(child => child.value.name !== '.config');
    } else {
      return children;
    }
  }
export let getAllParents = (tree, filePath) => {
    let results = [], parent = true;
    while (parent = getParent(tree, filePath)) {
      results.push(parent);
      filePath = parent.filePath;
    }
    return results;
  }

export let getAllChildren = (tree, filePath, showConfigs) => {
    let children = getChildren(tree, filePath, showConfigs);
    if(children.length === 0) {
      return [];
    } else {
      return children.reduce((results, child) => {
        let childPath = child.filePath;
        let children = getChildren(tree, childPath, showConfigs);
        return results.concat(child, children);  
      }, []);
    }
  }

export const createBoundMethods = (...args) => {
  return {
    parent: getParent.bind(null,...args),
    children: getChildren.bind(null,...args),
    parents: getAllParents.bind(null,...args),
    allChildren: getAllChildren.bind(null,...args)
  }

}


