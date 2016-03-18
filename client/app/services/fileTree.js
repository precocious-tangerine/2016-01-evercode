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

        return currPath;
      }         
    }, "");
  }
}



let convertToTree = function(snippetObj) {
 
  let userTreeMap = new TreeMap();


  Object.keys(snippetObj).forEach((key) => {
    userTreeMap.insertNode(key, snippetObj[key]);
  })
  window.test = userTreeMap;
  return userTreeMap
}


export default convertToTree;
