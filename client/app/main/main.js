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
  constructor($ngRedux, Folders, Auth, $state) {
    Auth.getUserInfo();
    Folders.getFileTree();
    this.$state = $state;
    this.Auth = Auth;
    this.Folders = Folders;
    $ngRedux.connect(this.mapStateToThis.bind(this))(this);
  }

  toggleSideView(path) {
    this.$state.is('main.' + path) ? this.$state.go('main.editor') : this.$state.go('main.' + path);
  }

  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
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
    this.avatar = activeUser ? activeUser.avatar_url : null;
    
    let parents = selectedFolder ? boundFT.parents(selectedFolder).reverse() : [];
    this.breadcrumbPath = selectedFolder ? parents.concat(boundFT.node(selectedFolder)) : [];
    return {
      snippetMap,
      selectedFolder,
      activeUser,
    };
  }

};