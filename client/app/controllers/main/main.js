import * as FT from '../../services/fileTree.js';

class MainCtrl {
  constructor($ngRedux, $state, $auth, Folders, Auth, Snippets, Public, focus) {
    if($auth.isAuthenticated()) {
      Auth.getUserInfo();
    }
    this.$state = $state;
    this.Auth = Auth;
    this.Folders = Folders;
    this.Snippets = Snippets;
    this.Public = Public;
    this.focus = focus;
    this.signinModalShow = false;
    this.signupModalShow = false;
    $ngRedux.connect(this.mapStateToThis.bind(this))(this);
  }

  toggleSideView(path) {
    this.Public.removeSelectedPublicSnippet();
    if(this.$state.is('main.' + path)) {
      this.$state.go('main.editor'); 
    } else {
      this.$state.go('main.' + path);
    }
  }

  openBlankTextEditor() {
    this.Public.removeSelectedPublicSnippet();
    this.Snippets.deselectSnippet();
    this.$state.go('main.editor'); 
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
    if(this.breadcrumbPath[0]) {
      this.breadcrumbPath[0].value = 'Home';
    }
    return {
      snippetMap,
      selectedFolder,
      activeUser
    };
  }

}

const mainPage = () => {
  return {
    url: '/main',
    restrict: 'E',
    controllerAs: 'mainCtrl',
    controller: MainCtrl,
    template: require('./main.html'),
    scope: {},
    access: { restricted: false }
  };
};

export default mainPage;

