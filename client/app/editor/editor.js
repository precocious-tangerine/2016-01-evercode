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
  constructor($ngRedux, Snippets) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.snippet = {};
    this.editorOptions = {
      lineWrapping: true,
      lineNumbers: true,
      readOnly: 'nocursor',
      mode: 'xml',
      value: 'hello'
    };
    this.tags = ['angular', 'directives', 'javascript'];
  }

  addSnippet() {
    this.Snippets.addSnippet({ name: this.snippet.name, content: this.content })
    this.snippet.name = '';
    this.content = '';
  };

  updateSnippet() {
    this.Snippets.updateSnippet(this.selectedSnippet._id, this.content);
  }

  mapStateToThis(state) {
    const { selectedSnippet } = state;
    const content = selectedSnippet.data;
    return {
      selectedSnippet,
      content
    };
  }
}
