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
    let path = this.selectedFolder ? this.selectedFolder + '/' + this.folder.name : this.snippetMap.__root.value + '/' + this.folder.name;
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
    let folders = !snippetMap.__root ? null : snippetMap.__root.children.filter(folder => !folder.endsWith('.config/')).map(el => (snippetMap[el]));
    let snippetArr = Object.keys(snippetMap).map(key => snippetMap[key]);
    return {
      folders,
      snippetMap,
      snippetArr,
      selectedFolder
    };
  }

};
