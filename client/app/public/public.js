export const publicPage = () => {
  return {
    url: '/public',
    restrict: 'E',
    controllerAs: 'public',
    controller: PublicCtrl,
    template: require('./public.html'),
    scope: {},
    access: { restricted: false }
  }
}

class PublicCtrl {
  constructor($ngRedux, $state, Snippets) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.snippetList = [];
    this.loading = true;
    Snippets.getPublicSnippets().then(res => {
      this.loading = false;     
      this.snippetList = res.data;
    });
  }

  openSnippet(snippet) {
    console.log('snippet path: ', snippet);
    this.$state.go('main.editor');
  }
}
