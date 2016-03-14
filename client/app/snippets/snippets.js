import * as Actions from '../redux/actions.js';

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
  constructor($location, $window, $ngRedux) {
    this.data = {};
    this.data.snippets = [{name: 'Redux'}];
    this.$location = $location;
    this.$window = $window;
    
    const unsubscribe = $ngRedux.connect(this.mapStateToThis, Actions)(this);
    $scope.$on('$destroy', unsubscribe);

  }

  mapStateToThis(state) {
    return {
      value: state.snippet;
    };
  }
}
