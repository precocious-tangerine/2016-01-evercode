class PublicCtrl {
  constructor($ngRedux, $state, $location, Public) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.$location = $location;
    this.Public = Public;
    this.snippetList = [];
    this.loading = true;
    this.editorModalShow = false;
    this.Public.getPublicSnippets().then(() => {
      this.loading = false;
    });

    this.checkIfUserHasVerified();
  }
  checkIfUserHasVerified() {
    if (this.$location.absUrl().indexOf('?') != -1) {
      let auth = this.$location.absUrl().slice(-13);
      if(auth === 'verified=true') {
        Materialize.toast('Your account has been verified! Please sign in', 3000, 'rounded');
      }
    }
  }
  toggleEditorModal(filepath) {
    this.Public.setSelectedPublicSnippet(filepath);
    this.editorModalShow = !this.editorModalShow;
  }

  openSnippet(filepath) {
    this.Public.setSelectedPublicSnippet(filepath);
    this.$state.go('main.editor.snippets');
  }

  mapStateToThis(state) {
    let { publicList, selectedPublicSnippet} = state;
    let snippetArr = Object.keys(publicList).map(key => {
      return publicList[key];
    });
    return {
      publicList,
      snippetArr,
      selectedPublicSnippet,
    };
  }
}
export const publicPage = () => {
  return {
    url: '/public',
    restrict: 'E',
    controllerAs: 'public',
    controller: PublicCtrl,
    template: require('./public.html'),
    scope: {},
    access: { restricted: false }
  };
};

