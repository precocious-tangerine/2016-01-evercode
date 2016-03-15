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
    this.Folders = Folders;
    this.data = {};
    this.data.folders = [{ name: 'React' }, { name: 'Angular' }, { name: 'Meteor' }, { name: 'Amber' }, { name: 'Backbone' }];
    this.folder = {};
    Folders.getTestFileTree();
  }

  addFolder() {
    this.Folders.addFolder({ path: this.folder.name });
    this.folder.name = '';
  }
  changeActiveTab(tabName) {

  }

  removeFolder(name) {
    this.Folders.removeFolder({ name: name });
  }

  mapStateToThis(state) {
    const { fileTree, selectedFolder } = state;
    const folders = !fileTree.children ? null : fileTree.children.map(function(folder) {
      return folder.value;
    })

    return {
      fileTree,
      selectedFolder,
      folders
    };
  }

};
