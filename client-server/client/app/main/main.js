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
  constructor($ngRedux, $state, $auth, Folders, Auth, Snippets) {
    $auth.isAuthenticated() ? Auth.getUserInfo(): null;
    this.$state = $state;
    this.Auth = Auth;
    this.Folders = Folders;
    this.Snippets = Snippets;
    this.signinModalShow = false;
    this.signupModalShow = false;
    $ngRedux.connect(this.mapStateToThis.bind(this))(this);
  }

  toggleSideView(path, newSnippet) {
    if(newSnippet){
      this.Snippets.deselectSnippet();
      this.$state.go('main.editor'); 
    } else {
      this.$state.is('main.' + path) ? this.$state.go('main.editor') : this.$state.go('main.' + path);
    }
  }

  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
  }

  signout() {
    this.Auth.signout();
  }

  toggleSigninModal() {
    this.signinModalShow = !this.signinModalShow;
  }
  toggleSignupModal() {
    this.signupModalShow = !this.signupModalShow;
  }
  mapStateToThis(state) {
    let { snippetMap, selectedFolder, activeUser } = state;
    let boundFT = snippetMap ? FT.createBoundMethods(snippetMap) : null; 
    this.avatar = activeUser ? activeUser.avatar_url : null;
    
    let parents = selectedFolder ? boundFT.parents(selectedFolder).reverse() : [];
    this.breadcrumbPath = selectedFolder ? parents.concat(boundFT.node(selectedFolder)) : [];
    this.breadcrumbPath[0] ? this.breadcrumbPath[0].value = 'Home' : null;
    return {
      snippetMap,
      selectedFolder,
      activeUser
    };
  }

};

