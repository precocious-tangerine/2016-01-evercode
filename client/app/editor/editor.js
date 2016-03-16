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
    this.Snippets = Snippets;
    this.snippet = {};
    this.editorOptions = {
      lineNumbers: true,
      indentWithTabs: true,
      theme: 'eclipse',
      lineWrapping: true,
      mode: 'javascript'
    };
    this.tag;
    this.content = this.content || 'hello world';
    this.addTag = true;
    this.showAnnotation = true;
  }

  toggleTag() {
    console.log('toggleTag', this.addTag);
    this.addTag = !this.addTag
  }

  toggleAnnotation() {
    console.log('toggleAnnotation', this.showAnnotation);
    this.showAnnotation = !this.showAnnotation;
  }

  addSnippet() {
    this.Snippets.addSnippet({ name: this.snippet.name, data: this.content, filePath: this.path+this.snippet.name })
  };

  updateSnippet() {
    this.Snippets.updateSnippet({ _id: this.selectedSnippet._id, data: this.content });
  }

  mapStateToThis(state) {
    const path = state.selectedFolder.filePath;
    const { selectedSnippet } = state;
    const content = selectedSnippet.data;
    return {
      path,
      selectedSnippet,
      content
    };
  }
}
