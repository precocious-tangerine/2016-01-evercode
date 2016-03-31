export const getNode = (tree, filePath) => {
  return tree[filePath] ? Object.assign({}, tree[filePath]) : null;
};
export let getParent = (tree, filePath) => {
    return tree[filePath] && tree[filePath].parent ? getNode(tree,tree[filePath].parent) : null;
};
export let getChildren = (tree, filePath, showConfigs) => {
    let children = tree[filePath].children.map(childPath => getNode(tree, childPath));
    if(!showConfigs) {
      return children.filter(child => child.value.name !== '.config');
    } else {
      return children;
    }
};
export let getAllParents = (tree, filePath) => {
    let results = [], parent = getParent(tree,filePath);
    while (parent) {
      results = [...results, parent];
      filePath = parent.filePath;
      parent = getParent(tree,filePath);
    }
    return results;
};
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
};
export const insertNode = (origTree, filePath, node) => {
  let tree = Object.assign({}, origTree, {__root: origTree.__root});
  let folders = filePath.split('/').filter(a => a).concat(node);
  let allOK = folders.reduce((prevPath, currItem) => {
    if(typeof currItem === 'object') {
      tree[prevPath].value = currItem;
      return true;
    } else {
      let currPath = prevPath + '/' + currItem;
      let parentObj = tree[prevPath], currObj = tree[currPath];
      if(prevPath && !parentObj) { 
        tree[prevPath] = {filePath: prevPath, children: []};
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
  }, '');
  return allOK ? tree : new Error('Error parsing filepath');
};
export const deleteNode = (origTree, filePath) => {
  let tree = Object.assign({}, origTree, {__root: origTree.__root});
  let childrenPaths = getAllChildren(tree, filePath, true).map(child => child.filePath);
  let parent = getParent(tree, filePath);
  childrenPaths.forEach(childPath => {
    delete tree[childPath];
  });
  parent.children.splice(parent.children.indexOf(filePath), 1);
  // parent.children = parent.children.filter(childPath => childPath !== filePath);
  delete tree[filePath];
  return tree;
};
export const updateNode = (origTree, origFilePath, updatedFilePath, updatedNode) => {
  let tree = Object.assign({}, origTree);
  let nodeToUpdate = Object.assign({}, tree[origFilePath], updatedNode);
  tree = deleteNode(tree, origFilePath);
  return insertNode(tree, updatedFilePath, nodeToUpdate.value);
};
export const convertToTree = (snippetObj) => {
  let userTreeMap = Object.keys(snippetObj).reduce( (prevTree, key) => {
    return insertNode(prevTree, key, snippetObj[key]);
  }, {});
  return userTreeMap;
};
export let getAllFoldersPaths = (tree, rootPath) => {
    let results = [];
    let traverse = (nodePath) => {
        if(typeof tree[nodePath].value === 'string') {
            results.push(tree[nodePath].filePath);
            tree[nodePath].children.forEach(childPath => {
              traverse(childPath);
            });
        }
    };
    traverse(rootPath);
    return results;
};
export const createBoundMethods = (...args) => {
  return {
    node: getNode.bind(null,...args),
    parent: getParent.bind(null,...args),
    children: getChildren.bind(null,...args),
    parents: getAllParents.bind(null,...args),
    allChildren: getAllChildren.bind(null,...args)
  };

};
