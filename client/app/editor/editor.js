export const editor = () => {
return {
    url: '/editor',
    restrict: 'E',
    controllerAs: 'directories',
    controller: EditorCtrl,
    template: require('./editor.html'),
    scope: {},
    access: {restricted: true}
  }
}

class EditorCtrl {
  constructor() {
    this.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        readOnly: 'nocursor',
        mode: 'xml',
        value: 'hello'
    };
    this.tags = ['angular','directives','javascript'];
  }
}
