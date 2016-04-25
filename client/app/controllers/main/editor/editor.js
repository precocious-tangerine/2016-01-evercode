export class EditorCtrl {
  constructor($ngRedux, Snippets, Auth, Public, UrlEncoding, $state, $location, focus) {
    this.$location = $location;
    this.$state = $state;
    this.Snippets = Snippets;
    this.Auth = Auth;
    this.Public = Public;
    this.decodeId = UrlEncoding.decodeId;
    this.shorten = UrlEncoding.shorten;
    this.focus = focus;
    this.cmLanguages = ['javascript', 'python', 'clike', 'ruby', 'php', 'sql', 'css', 'htmlmixed'];
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
    this.getSharedSnippet();
    $ngRedux.connect(this.mapStateToThis.bind(this))(this);
  }
  hideModal() {
    this.show = false;
  }
  codemirrorLoaded(_editor) {
    this.editor = _editor;
  }
  getSharedSnippet() {
    if (this.$location.absUrl().indexOf('?') != -1) {
      let query = this.$location.absUrl().slice(-18);
      if (query.substr(0, 2) == 's=') {
        let base62String = query.slice(-16);
        let id = this.decodeId(base62String);
        this.Public.getSharedSnippet(id);
      }
    }
  }
  toggleTag() {
    this.addTag = this.selectedSnippet ? !this.addTag : Materialize.toast('Create a snippet first', 3000, 'rounded');
    this.tag = '';
    this.focus('input-tag');
  }
  toggleAnnotation() {
    this.showAnnotation = !this.showAnnotation;
  }
  removeOrAddTag(tagToRemove) {
    let objectToUpdate = Object.assign({}, this.snippetMap[this.selectedSnippet].value);
    if (this.tag) {
      if (objectToUpdate.tags.length >= 5){
        Materialize.toast('Cant have more then 5 tags on the snippet!', 3000, 'rounded');
        return;
      }
      if(objectToUpdate.tags.indexOf(this.tag) !== -1){
        Materialize.toast('Cant add duplicate tag to the snippet!', 3000, 'rounded');
        return;
      } else {
        objectToUpdate.tags.push(this.tag);
        this.tag = '';
      }
    }
    if (tagToRemove) {
      objectToUpdate.tags.splice(objectToUpdate.tags.indexOf(tagToRemove), 1);
    }
    this.Snippets.updateSnippet(objectToUpdate, this.snippetMap[this.selectedSnippet].filePath);
  }
  updateSnippet(snippetPath) {
    let objectToUpdate = Object.assign({},
      this.snippetMap[snippetPath].value, {
        data: this.snippetObj.data,
        name: this.snippetObj.name,
        language: this.snippetObj.language,
        shortcut: this.snippetObj.shortcut,
        public: this.snippetObj.public,
        annotation: this.snippetObj.annotation,
        description: this.snippetObj.description,
        username: this.activeUser.username
      });
    objectToUpdate.filePath = this.snippetMap[snippetPath].parent + '/' + this.snippetObj.name;
    this.Snippets.updateSnippet(objectToUpdate, this.snippetMap[snippetPath].filePath);
  }
  addSnippet() {
    if (!this.activeUser.username) {
      Materialize.toast('Please, sign in first', 3000, 'rounded');
    } else {
      let objectToUpdate = (this.snippetObj.username !== this.activeUser.username) ? Object.assign({}, {
        data: this.snippetObj.data,
        name: this.snippetObj.name,
        language: this.snippetObj.language,
        public: false,
        annotation: this.snippetObj.annotation,
        description: this.snippetObj.description,
        username: this.activeUser.username
      }) : this.snippetObj;
      let path = this.path + '/' + this.snippetObj.name;
      objectToUpdate.shortcut = objectToUpdate.shortcut || this.snippetObj.name;
      if (!this.snippetObj.name) {
        Materialize.toast('Please, name the snippet', 3000, 'rounded');
      } else if (!this.snippetMap[path]) {
        objectToUpdate.filePath = path;
        this.Snippets.addSnippet(objectToUpdate);
      } else {
        Materialize.toast('Can not use duplicate name', 3000, 'rounded');
      }
    }
  }
  buttonTrigger() {
    if (!this.activeUser.username) {
      Materialize.toast('Please, sign in or sign up first', 3000, 'rounded');
    } else if (this.selectedSnippet) {
      this.updateSnippet(this.selectedSnippet);
    } else if (this.selectedPublicSnippet in this.snippetMap) {
      this.updateSnippet(this.selectedPublicSnippet);
    } else {
      this.addSnippet();
      this.editor.setOption('readOnly', false);
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
    this.updateSnippet(this.snippetObj.filePath);
  }
  confirmCopyAction(element) {
    Materialize.toast(element + ' added to your clipboard!', 3000, 'rounded');
  }
  mapStateToThis(state) {
    let { selectedFolder, selectedSnippet, snippetMap, activeUser, selectedPublicSnippet, publicList } = state;
    let userTheme = activeUser.theme ? activeUser.theme : 'eclipse';
    if (userTheme !== this.editorOptions && this.editor) {
      this.editor.setOption('theme', userTheme);
    }
    let path = selectedFolder && (selectedFolder in snippetMap) ? snippetMap[selectedFolder].filePath : null;
    let editorOptions = {
      lineNumbers: true,
      indentWithTabs: true,
      theme: userTheme,
      lineWrapping: true,
      mode: 'javascript'
    };
    let snippetObj = {};
    if (selectedSnippet && (selectedSnippet in snippetMap)) {
      Object.assign(snippetObj, snippetMap[selectedSnippet].value);
      if (this.editor) {
        this.editor.setOption('readOnly', false);
      }
    } else if (selectedPublicSnippet && (selectedPublicSnippet in publicList)) {
      Object.assign(snippetObj, publicList[selectedPublicSnippet].value);
      if (this.editor) {
        this.editor.setOption('readOnly', 'nocursor');
      }
    } else {
      snippetObj.language = activeUser.username ? activeUser.language : this.cmDefaults.language;
      if (this.editor) {
        this.editor.setOption('readOnly', false);
      }
    }
    this.tag = '';
    let buttonText;
    if (selectedPublicSnippet && snippetObj.username !== activeUser.username) {
      buttonText = 'Save Snippet';
    } else if (selectedSnippet || (selectedPublicSnippet in snippetMap)) {
      buttonText = 'Update Snippet';
    } else {
      buttonText = 'Add Snippet';
    }
    setTimeout(() => {
      if(this.editor) {
        this.editor.refresh();
      }
    }, 1);
    return {
      path,
      snippetMap,
      selectedSnippet,
      selectedPublicSnippet,
      buttonText,
      snippetObj,
      userTheme,
      editorOptions,
      activeUser,
      publicList
    };
  }
}

export const editor = () => {
  return {
    url: '/editor',
    restrict: 'E',
    controllerAs: 'editor',
    controller: EditorCtrl,
    template: require('./editor.html'),
    scope: {},
    access: { restricted: false }
  };
};

