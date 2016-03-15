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
    this.data.snippets = [{ name: 'Redux' }, { name: 'Express' }, { name: 'Login' }, { name: 'Auth' }, { name: 'Navbar' }];
    this.Snippets = Snippets;
  }

  copySnippet(snippet) {
    this.Snippets.getSnippet({ snippetId: snippet._id });
  };

  favoriteSnippet(snippet) {
    this.Snippets.updateSnippet({ snippetId: snippet._id, value: {favorite: true} });
  }


  mapStateToThis(state) {
    const { selectedSnippet } = state;
    return { selectedSnippet };
  };
}
