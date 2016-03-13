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
  constructor($scope, $location, $window, Auth) {
    this.data = {};
    this.data.snippets = [{name: 'Redux'}];
  }

  addSnippet() {
    
  }
  removeSnippet() {
    
  }
}
