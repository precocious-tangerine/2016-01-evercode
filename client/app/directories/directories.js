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
  constructor($ngRedux, Folders, Auth, $location, $state) {
    $ngRedux.connect(this.mapStateToThis)(this);
    Auth.getUserInfo();
    Folders.getFileTree();
    this.Folders = Folders;
    this.folder = {};
    this.snippetArr = [];
    this.$state = $state;
    this.$location = $location;
    this.loc = this.$location.path();
  }

  toggleSideView(path) {
    this.$location.path() === '/main/'+path ? this.$state.go('main') : this.$state.go('main.'+path);
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
    let { snippetMap, selectedFolder, activeUser } = state;
    let user = {};
    user.avatar = activeUser ?  activeUser.avatar_url : "https://d30y9cdsu7xlg0.cloudfront.net/png/17485-200.png"; 
    let folders = !snippetMap.__root ? null : snippetMap.__root.children.filter(folder => !folder.endsWith('.config')).map(el => (snippetMap[el]));
    let snippetArr =  [];
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value
      if(typeof snippetVal === 'object') {
        if(snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          snippetArr.push(snippetVal);
        }
      }
    });
    let breadcrumbPath = activeUser.name;
    let convertPath = (path) => {
      let result = [];
      while(snippetMap[path]) {
        result.unshift([snippetMap[path].value, snippetMap[path].filePath]);
        path = snippetMap[path].parent;
      }
      return result
    }
    breadcrumbPath = convertPath(selectedFolder);
    return {
      folders,
      snippetMap,
      snippetArr,
      selectedFolder,
      breadcrumbPath,
      user
    };
  }

};
