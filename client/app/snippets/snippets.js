export default function snippets(url) {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require('./snippets.html'),
    scope: {}
  };
}

class SnippetsCtrl {
  constructor($ngRedux) {
    this.data = {};
  }

  addSnippet() {
    
  }
  removeSnippet() {
    
  }
}
