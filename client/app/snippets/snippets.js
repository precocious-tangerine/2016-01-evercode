export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require('./snippets.html'),
    scope: {}
  };
}

class SnippetsCtrl {
  constructor($location, $window, $ngRedux, $scope, Snippets) {
    this.data = {};
    this.data.snippets = [{name: 'Redux'}];
    this.$location = $location;
    this.$window = $window;
    this.Snippets = Snippets;

    $ngRedux.connect(this.mapStateToThis)(this);
  }

  mapStateToThis(state) {
    return {
      value: state.selectedSnippet
    };
  }

  addSnippet() {
    console.log('addSnippet: ', this.snippet);
    this.Snippets.addSnippet({ name: this.snippet.name })
    this.snippet.name = '';
  };

  removeSnippet() {
    this.Snippets.removeSnippet({ name: this.snippet.name })
    this.snippet.name = '';
  };

}
