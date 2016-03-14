import * as Actions from '../redux/actions.js';

export const editor = () => {
return {
    url: '/editor',
    restrict: 'E',
    controllerAs: 'editor',
    controller: EditorCtrl,
    template: require('./editor.html'),
    scope: {},
    access: {restricted: true}
  }
}

class EditorCtrl {
  constructor($ngRedux, $scope) {
    this.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        readOnly: 'nocursor',
        mode: 'xml',
        value: 'hello'
    };
    this.tags = ['angular','directives','javascript'];

    const unsubscribe = $ngRedux.connect(this.mapStateToThis, Actions)(this);
    $scope.$on('$destroy', unsubscribe);
  }

  mapStateToThis(state) {
    return {
      value: state.selectedSnippet
    };
  }
}
