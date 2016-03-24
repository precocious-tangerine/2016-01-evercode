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
    this.codemirrorLoaded = (_editor) =>{
      this.editor = _editor;
    };
    this.cmLanguages = ['javascript', 'python']
    this.cmThemes = ['eclipse', 'twilight']
    this.cmDefaults = {language: 'javascript', theme: 'eclipse'};
    this.tinymceOptions = {
      height: 250,
      toolbar: 'bold italic | bullist numlist'
    };
    this.tag = '';
    this.addTag = false;
    this.showAnnotation = false;
  }

  toggleTag() {
    this.addTag = this.selectedSnippet ? !this.addTag : Materialize.toast('Create a snippet first', 3000, 'rounded');

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
      objectToUpdate.tags.splice(objectToUpdate.tags.indexOf(tagToRemove), 1);
    }
    let _id = objectToUpdate._id;
    delete objectToUpdate._id;
    this.Snippets.updateSnippet({ snippetId: _id, value: objectToUpdate }, this.snippetMap[this.selectedSnippet].filePath);
  }

  updateSnippet() {
    let objectToUpdate = Object.assign({}, this.snippetMap[this.selectedSnippet].value, { data: this.snippetObj.data, name: this.snippetObj.name, language: this.snippetObj.language, shortcut: this.snippetObj.shortcut, public: this.snippetObj.public });
    objectToUpdate.filePath = this.snippetMap[this.selectedSnippet].parent + '/' + this.snippetObj.name;
    let _id = objectToUpdate._id;
    delete objectToUpdate._id;
    this.Snippets.updateSnippet({ snippetId: _id, value: objectToUpdate }, this.snippetMap[this.selectedSnippet].filePath);
  }

  addSnippet() {
    this.snippetObj.filePath = this.path + '/' + this.snippetObj.name;
    this.Snippets.addSnippet(this.snippetObj);
  }

  addAnnotation() {
    let annotationObj = {
      id: this.snippetMap[this.selectedSnippet].value._id, 
      data: this.annotation,
    }
    this.Snippets.addAnnotation(annotationObj)
  }

  changeLanguage(language) {
    this.editor.setOption('mode', language)
  }

  changeTheme(theme) {
    this.editor.setOption('theme', theme)
  }

  togglePublic() {
    this.snippetObj.public = !this.snippetObj.public;
    this.updateSnippet();
  }

  mapStateToThis(state) {
    let { selectedFolder, selectedSnippet, snippetMap } = state;
    let path = !selectedFolder ? null : snippetMap[selectedFolder].filePath;
    let buttonText = selectedSnippet ? 'Update Snippet' : 'Add Snippet';
    let snippetObj = {};
    snippetObj.data = selectedSnippet ? snippetMap[selectedSnippet].value.data : ' ';
    snippetObj.name = selectedSnippet ? snippetMap[selectedSnippet].value.name : '';
    snippetObj.shortcut = selectedSnippet ? snippetMap[selectedSnippet].value.shortcut : '';
    snippetObj.language = selectedSnippet ? snippetMap[selectedSnippet].value.language : '';
    snippetObj.public = selectedSnippet ? snippetMap[selectedSnippet].value.public : '';
    return {
      path,
      snippetMap,
      selectedSnippet,
      buttonText,
      snippetObj
    };
  }
}
