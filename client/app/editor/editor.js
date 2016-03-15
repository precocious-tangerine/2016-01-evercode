
export const editor = () => {
  return {
    url: '/editor',
    restrict: 'E',
    controllerAs: 'editor',
    controller: EditorCtrl,
    template: require('./editor.html'),
    scope: {},
    access: { restricted: true }
  }
}

class EditorCtrl {
  constructor($ngRedux, $scope, Snippets) {
    this.tags = ['angular','directives','javascript'];
    this.Snippets = Snippets;

    const unsubscribe = $ngRedux.connect(this.mapStateToThis)(this);
    $scope.$on('$destroy', unsubscribe);
  }

  mapStateToThis(state) {
    return {
      value: state.selectedSnippet
    };
  }

  updateSnippet(name, value) {
    this.Snippets.updateSnippet({ name, value })
  }
}
