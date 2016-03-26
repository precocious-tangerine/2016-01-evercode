export const editor = () => {
  return {
    url: '/editor',
    restrict: 'E',
    controllerAs: 'editor',
    controller: EditorCtrl,
    template: require('./editor.html'),
    scope: {},
    access: { restricted: false }
  }
}

class EditorCtrl {
  constructor($ngRedux, Snippets, Auth, $state, Public) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.Snippets = Snippets;
    this.Auth = Auth;
    this.Public = Public;
    this.codemirrorLoaded = (_editor) => {
      this.editor = _editor;
    };
    this.cmLanguages = ['javascript', 'python', 'clike', 'ruby', 'php', 'sql', 'css', 'htmlmixed']
    this.cmThemes = ['eclipse', 'twilight', '3024-day', 'ambiance', 'cobalt', 'material', 'mdn-like', 'paraiso-light', 'rubyblue', 'yeti', 'zenburn'];
    this.cmDefaults = { language: 'javascript', theme: 'eclipse' };
    this.tinymceOptions = {
      height: '40vh',
      toolbar: 'styleselect | bold italic | bullist numlist outdent indent',
      menubar: false,
      statusbar: false
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
    let objectToUpdate = Object.assign({},
      this.snippetMap[this.selectedSnippet].value, 
      { data: this.snippetObj.data,
        name: this.snippetObj.name,
        language: this.snippetObj.language,
        shortcut: this.snippetObj.shortcut,
        public: this.snippetObj.public,
        annotation: this.snippetObj.annotation,
        description: this.snippetObj.description
      });
    objectToUpdate.filePath = this.snippetMap[this.selectedSnippet].parent + '/' + this.snippetObj.name;
    let _id = objectToUpdate._id;
    delete objectToUpdate._id;
    this.Snippets.updateSnippet({ snippetId: _id, value: objectToUpdate }, this.snippetMap[this.selectedSnippet].filePath);
  }

  addSnippet() {
    let path = this.path + '/' + this.snippetObj.name;
    if(!this.snippetObj.name){
      Materialize.toast('Please, name the snippet', 3000, 'rounded');
    } else if(!this.snippetMap[path]){
      this.snippetObj.filePath = path;
      this.Snippets.addSnippet(this.snippetObj);
    } else {
      Materialize.toast('Can not use duplicate name', 3000, 'rounded');
    }
  }

  addAnnotation() {
    let annotationObj = {
      id: this.snippetMap[this.selectedSnippet].value._id,
      data: this.annotation,
    };
    this.Snippets.addAnnotation(annotationObj);
  }

  changeLanguage(language) {
    this.editor.setOption('mode', language);
  }

  changeTheme(theme) {
    this.editor.setOption('theme', theme);
    this.Auth.updateUser({ theme: theme });
  }

  togglePublic() {
    this.snippetObj.public = !this.snippetObj.public;
    this.updateSnippet();
  }

  mapStateToThis(state) {
    let { selectedFolder, selectedSnippet, snippetMap, activeUser, selectedPublicSnippet, publicList } = state;
    let userTheme = activeUser.theme ? activeUser.theme : 'eclipse';
    let path = !selectedFolder ? null : snippetMap[selectedFolder].filePath;
    let buttonText = selectedSnippet ? 'Update Snippet' : 'Add Snippet';
    let editorOptions = {
      lineNumbers: true,
      indentWithTabs: true,
      theme: userTheme,
      lineWrapping: true,
      mode: 'javascript'
    };
    let snippetObj = {};
    if(selectedSnippet && !$.isEmptyObject(snippetMap)) {
      Object.assign(snippetObj, snippetMap[selectedSnippet].value)
    } else if (selectedPublicSnippet && !$.isEmptyObject(publicList)) {
      Object.assign(snippetObj, publicList[selectedPublicSnippet])
    } else {
      snippetObj.language = 'javascript'
    }

    return {
      path,
      snippetMap,
      selectedSnippet,
      buttonText,
      snippetObj,
      userTheme,
      editorOptions
    };
  }
}