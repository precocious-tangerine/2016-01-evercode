export const directories = () => {
  return {
    url: '/main',
    restrict: 'E',
    controllerAs: 'directories',
    controller: DirectoriesCtrl,
    template: require('./main.html'),
    scope: {},
    access: { restricted: true }
  }
}

class DirectoriesCtrl {
  constructor($ngRedux, Folders) {
    $ngRedux.connect(this.mapStateToThis)(this);
    Folders.getFileTree();
    this.Folders = Folders;
    this.folder = {};
    this.snippetArr = [];
  }

  addFolder() {
    let path = this.snippetMap.__root.value + '/' + this.folder.name;
    this.Folders.addFolder({ path: path });
    this.folder.name = '';
  }

  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
  }

  removeFolder(folderPath) {
    this.Folders.removeFolder(folderPath);
  }

  mapStateToThis(state) {
    let { snippetMap, selectedFolder } = state;
    window.snippetMapPeek = snippetMap
    let folders = !snippetMap.__root ? null : snippetMap.__root.children.filter(folder => !folder.endsWith('.config/')).map(el => (snippetMap[el]));
    let snippetArr =  [];
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value
      if(typeof snippetVal === 'object') {
        if(snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          snippetArr.push(snippetVal);
        }
      }
    });
    let convertPath = (path) => {
      let result = [];
      while(snippetMap[path]) {
        let urlPath = snippetMap[path].parent ? '.snippets' : 'main';
        result.unshift([snippetMap[path].value, snippetMap[path].filePath, urlPath]);
        path = snippetMap[path].parent;
      }
      return result
    }
    let breadcrumbPath = convertPath(selectedFolder);
    return {
      folders,
      snippetMap,
      snippetArr,
      selectedFolder,
      breadcrumbPath
    };
  }

};
