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
  constructor($ngRedux, Snippets, Auth, Public, $state, $location, $http) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$http = $http;
    this.$location = $location;
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
    this.getSharedSnippet();
  }

  getSharedSnippet() {
    if(this.$location.absUrl().indexOf("?") != -1) {
      let id = this.$location.absUrl().slice(-24);
      this.$http({
          method: 'GET',
          url: '/share?s=' + id ,
        })
        .then((response) => {
          this.Public.setPublicList(response.data);
          this.Public.setSelectedPublicSnippet("share");
        });
    }
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
    }
    if (tagToRemove) {
      objectToUpdate.tags.splice(objectToUpdate.tags.indexOf(tagToRemove), 1);
    }
    this.Snippets.updateSnippet(objectToUpdate, this.snippetMap[this.selectedSnippet].filePath);
  }

  updateSnippet() {
    let objectToUpdate = Object.assign({},
      this.snippetMap[this.selectedSnippet].value, {
        data: this.snippetObj.data,
        name: this.snippetObj.name,
        language: this.snippetObj.language,
        shortcut: this.snippetObj.shortcut,
        public: this.snippetObj.public,
        annotation: this.snippetObj.annotation,
        description: this.snippetObj.description
      });
    objectToUpdate.filePath = this.snippetMap[this.selectedSnippet].parent + '/' + this.snippetObj.name;
    this.Snippets.updateSnippet(objectToUpdate, this.snippetMap[this.selectedSnippet].filePath);
  }

  addSnippet() {
    let objectToUpdate = (this.snippetObj.username !== this.activeUser.username) ? Object.assign({}, {
      data: this.snippetObj.data,
      name: this.snippetObj.name,
      language: this.snippetObj.language,
      public: false,
      annotation: this.snippetObj.annotation,
      description: this.snippetObj.description
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

  buttonTrigger() {
    if (this.selectedSnippet) {
      this.updateSnippet();
    } else if (this.selectedPublicSnippet && !this.activeUser.username) {
      Materialize.toast('Sign in or sign up to fork', 3000, 'rounded');
    } else {
      this.addSnippet();
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
    let editorOptions = {
      lineNumbers: true,
      indentWithTabs: true,
      theme: userTheme,
      lineWrapping: true,
      mode: 'javascript'
    };
    let snippetObj = {};
    if (selectedSnippet && (selectedSnippet in snippetMap)) {
      Object.assign(snippetObj, snippetMap[selectedSnippet].value)
    } else if (selectedPublicSnippet && !$.isEmptyObject(publicList)) {
      Object.assign(snippetObj, publicList[selectedPublicSnippet])
      editorOptions.readOnly = snippetObj.username !== activeUser.username ? true : false;
    } else {
      snippetObj.language = activeUser.language;
    }

    let buttonText;
    if (selectedPublicSnippet && snippetObj.username !== activeUser.username) {
      buttonText = 'Fork Snippet';
    } else if (selectedSnippet) {
      buttonText = 'Update Snippet';
    } else {
      buttonText = 'Add Snippet';
    }

    return {
      path,
      snippetMap,
      selectedSnippet,
      selectedPublicSnippet,
      buttonText,
      snippetObj,
      userTheme,
      editorOptions,
      activeUser
    };
  }
}
