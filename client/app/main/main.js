import * as FT from '../services/fileTree.js'
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
    this.clickedPath = false;
    $ngRedux.connect(this.mapStateToThis.bind(this))(this);
    Auth.getUserInfo();
    Folders.getFileTree();
    this.$state = $state;
    this.$location = $location;
    this.Auth = Auth;
    this.Folders = Folders;
  }

  toggleSideView(path) {
    this.$state.is('main.' + path) ? this.$state.go('main.editor') : this.$state.go('main.' + path);
  }

  changeActiveTab(folderPath) {
    this.clickedPath = true;
    this.Folders.selectFolder(folderPath.value);
  }

  signout() {
    this.Auth.signout();
  }

  openModal() {
    $('.lean-overlay').remove();
    $('.modal-trigger').leanModal();
    $('#signin-modal').openModal();
  }

  mapStateToThis(state) {
    let { snippetMap, selectedFolder, activeUser } = state;
    let boundFT = snippetMap ? FT.createBoundMethods(snippetMap) : null;
    let avatar = activeUser ? activeUser.avatar_url : null;
    let breadcrumbPath = selectedFolder ? boundFT.parents(selectedFolder).reverse().concat(boundFT.node(selectedFolder)) : null;
    this.clickedPath = false;
    return {
      snippetMap,
      selectedFolder,
      breadcrumbPath,
      avatar,
      activeUser
    };
  }

};