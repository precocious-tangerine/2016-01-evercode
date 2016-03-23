export const createMainCtrl = () => {
  return {
    url: '/main',
    restrict: 'E',
    controllerAs: 'mainCtrl',
    controller: MainCtrl,
    template: require('./main.html'),
    scope: {},
    access: { restricted: false }
  }
}

class MainCtrl {
  constructor($ngRedux, Folders, Auth, $location, $state) {
    $ngRedux.connect(this.mapStateToThis)(this);
    Auth.getUserInfo();
    Folders.getFileTree();
    this.$state = $state;
    this.$location = $location;
    this.Auth = Auth;
  }

  toggleSideView(path) {
    this.$location.path() === '/main/' + path ? this.$state.go('main') : this.$state.go('main.' + path);
  }

  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
  }

  signout() {
    this.Auth.signout();
  }

  mapStateToThis(state) {
    let { snippetMap, selectedFolder, activeUser } = state;
    let avatar = activeUser ? activeUser.avatar_url : null;
    let convertPath = (path) => {
      let result = [];
      while (snippetMap[path]) {
        result.unshift([snippetMap[path].value, snippetMap[path].filePath]);
        path = snippetMap[path].parent;
      }
      return result
    };

    let breadcrumbPath = convertPath(selectedFolder);
    return {
      snippetMap,
      selectedFolder,
      breadcrumbPath,
      avatar,
      activeUser
    };
  }

};