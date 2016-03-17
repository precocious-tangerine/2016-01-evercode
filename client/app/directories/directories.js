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
    window.directoriesStuff = this;
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
    let visibleFolders, snippetArr = [];

    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value
      if(snippetVal === 'object') {
        if(snippetVal.name === '.config' || snippetVal.name === '/.config') {
          snippetArr.push(snippetVal.value);
        }
      } else {
        visibleFolders.push(snippetVal);
      }
    });

    return {
      visibleFolders,
      snippetMap,
      snippetArr,
      selectedFolder
    };
  }

};
