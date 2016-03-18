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

  addOrUpdateSnippet() {
    if (selectedSnippet) {
      this.Snippets.updateSnippet({ _id: this.selectedSnippet._id, data: this.content });
    } else {
      let snippet = {
        name: this.snippet.name,
        data: this.content,
        filePath: this.path + this.snippet.name
      };
      this.Snippets.addSnippet(snippet);
    }
  }


  mapStateToThis(state) {
    let { selectedFolder, selectedSnippet, snippetMap } = state;
    let path = !selectedFolder ? null : snippetMap[selectedFolder].filePath;
    let content = !selectedSnippet ? '' : snippetMap[selectedSnippet].value.data;
    let snippetName = selectedSnippet ? snippetMap[selectedSnippet].value.name : '';
    let buttonText = selectedSnippet ? 'Update Snippet' : 'Add Snippet';
    return {
      path,
      snippetMap,
      selectedSnippet,
      content,
      buttonText,
      snippetName
    };
  }
}
