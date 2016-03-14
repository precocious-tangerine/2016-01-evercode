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
  constructor($location, $window) {
    this.data = {};
    this.data.snippets = [{name: 'Redux'}];
    this.$location = $location;
    this.$window = $window;
  }

  addSnippet() {
    
  }
  removeSnippet() {
    
  }
}
