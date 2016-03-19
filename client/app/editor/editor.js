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
    this.editorOptions = {
      lineNumbers: true,
      indentWithTabs: true,
      theme: 'eclipse',
      lineWrapping: true,
      mode: 'javascript'
    };
    this.tag = '';
    this.tagToRemove = '';
    this.addTag = false;
    this.showAnnotation = false;
  }

  toggleTag() {
    this.addTag = !this.addTag;
  }

  toggleAnnotation() {
    this.showAnnotation = !this.showAnnotation;
  }

  removeOrAddTag(tagToRemove) {
    let objectToUpdate = Object.assign({}, this.snippetMap[this.selectedSnippet].value);
    if (this.tag) {
      objectToUpdate.tags.push(this.tag);
      this.tag = '';
      this.toggleTag();
    }
    if (tagToRemove) {
      objectToUpdate.tags.splice(objectToUpdate.tags.indexOf(this.tagToRemove), 1);
      this.tagToRemove = '';
    }
    let _id = objectToUpdate._id;
    delete objectToUpdate._id;
    this.Snippets.updateSnippet({ snippetId: _id, value: objectToUpdate }, this.snippetMap[this.selectedSnippet].filePath);
  }

  updateSnippet() {
    let objectToUpdate = Object.assign({}, this.snippetMap[this.selectedSnippet].value, { data: this.snippetObj.data, name: this.snippetObj.name });
    objectToUpdate.filePath = this.snippetMap[this.selectedSnippet].parent + '/' + this.snippetObj.name;
    let _id = objectToUpdate._id;
    delete objectToUpdate._id;
    this.Snippets.updateSnippet({ snippetId: _id, value: objectToUpdate }, this.snippetMap[this.selectedSnippet].filePath);
  }

  addSnippet() {
    this.snippetObj.filePath = this.path + '/' + this.snippetObj.name;
    this.Snippets.addSnippet(this.snippetObj);
  }

  mapStateToThis(state) {
    let { selectedFolder, selectedSnippet, snippetMap } = state;
    let path = !selectedFolder ? null : snippetMap[selectedFolder].filePath;
    let buttonText = selectedSnippet ? 'Update Snippet' : 'Add Snippet';
    let snippetObj = {};
    snippetObj.data = !selectedSnippet ? ' ' : snippetMap[selectedSnippet].value.data;
    snippetObj.name = selectedSnippet ? snippetMap[selectedSnippet].value.name : '';
    return {
      path,
      snippetMap,
      selectedSnippet,
      buttonText,
      snippetObj
    };
  }
}
