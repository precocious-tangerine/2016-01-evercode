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
    // window.snippetArr = this.snippetArr;
  }

  addFolder() {
    this.Folders.addFolder({ folder: this.folder.name });
    this.folder.name = '';
  }
  changeActiveTab(folder) {
    this.Folders.selectFolder(folder);
  }

  removeFolder(name) {
    this.Folders.removeFolder({ name: name });
  }

  mapStateToThis(state) {
    window.statePeek = state;
    const {selectedFolder, snippetMap } = state;
    // const folders = !fileTree.children ? null : fileTree.children.filter(folder => (folder.children.length > 0));
    // const snippetArr = Object.keys(snippetMap).map(key => snippetMap[key]);
    return {
      selectedFolder,
      //folders,
      snippetMap
      //snippetArr
     
    };
  }

};
