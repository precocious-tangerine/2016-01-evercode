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
    this.addTag = !this.addTag
  }

  toggleAnnotation() {
    console.log('toggleAnnotation', this.showAnnotation);
    this.showAnnotation = !this.showAnnotation;
  }

  addSnippet() {
    let snippet = {
      name: this.snippet.name,
      data: this.content,
      filePath: this.path + this.snippet.name
    };
    this.Snippets.addSnippet(snippet);
  }

  updateSnippet() {
    this.Snippets.updateSnippet({ _id: this.selectedSnippet._id, data: this.content });
  }

  mapStateToThis(state) {
    let { selectedFolder, selectedSnippet, snippetMap } = state;
    let path = !selectedFolder ? null : snippetMap[selectedFolder].filePath;
    let content = !selectedSnippet ? null : snippetMap[selectedSnippet].value.data;
    return {
      path,
      snippetMap,
      selectedSnippet,
      content
    };
  }
}
