export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require('./snippets.html'),
    scope: {},
    access: { restricted: true }
  };
}

class SnippetsCtrl {
  constructor($ngRedux, Snippets) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.data = {};
    this.data.snippets = [{ name: 'Redux' }];
    this.Snippets = Snippets;
  }

  addSnippet() {
    this.Snippets.addSnippet({ name: this.snippet.name })
    this.snippet.name = '';
  };

  removeSnippet(name) {
    this.Snippets.removeSnippet({ name: name });
  };

  updateSnippet(name) {
    this.Snippets.updateSnippet({ name: name });
  };


  mapStateToThis(state) {
    const { selectedSnippet } = state;
    return {selectedSnippet};
  };
}
