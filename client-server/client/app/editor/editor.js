class EditorCtrl {
  constructor($ngRedux, Snippets, Auth, Public, $state, $location, focus) {
    this.$location = $location;
    this.$state = $state;
    this.Snippets = Snippets;
    this.Auth = Auth;
    this.Public = Public;
    this.focus = focus;
    this.codemirrorLoaded = (_editor) => {
      this.editor = _editor;
    };
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

  getSharedSnippet() {
    if (this.$location.absUrl().indexOf('?') != -1) {
      let query = this.$location.absUrl().slice(-18);
      if (query.substr(0, 2) == 's=') {
        let base62String = query.slice(-16);
        let charMap = {'e':0,'d':1,'i':2,'s':3,'o':4,'n':5,'g':6,'h':7,'c':8,'j':9, 'k':10,'l':11,'m':12,'f':13,'a':14,'p':15,'q':16,'r':17,'b':18,'t':19,'u':20,'v':21,'w':22,'x':23,'y':24,'z':25,'E':26,'D':27,'I':28,'S':29,'O':30,'N':31,'A':32,'B':33,'C':34,'F':35,'G':36,'H':37,'J':38,'K':39,'L':40,'M':41,'P':42,'Q':43,'R':44,'T':45,'U':46,'V':47,'W':48,'X':49,'Y':50,'Z':51,'0':52,'1':53,'2':54,'3':55,'4':56,'5':57,'6':58,'7':59,'8':60,'9':61,};
        let base62Chunks = [];
        let id = '';
        for (let i = 0; i < base62String.length; i += 8){
          if(base62String[i + 9]){
            base62Chunks.push(base62String.slice(i, i + 9));
          } else {
            base62Chunks.push(base62String.slice(i));
          }
        }                      
        for (let i = 0; i < base62Chunks.length; i++){
          let n = 0;
          for (let j = 0; j < base62Chunks[i].length ; j++) {
            let val = charMap[base62Chunks[i][base62Chunks[i].length - (1+j)]];
            n += (val) * Math.pow(62, j);
          }
          id = n.toString(16) + id;  
        }

        this.Public.getSharedSnippet(id);
      }
    }
  }

  shorten(hexString) {
    let charSet = ['e','d','i','s','o','n','g','h','c','j','k','l','m','f','a','p','q','r','b','t','u','v','w','x','y','z','E','D','I','S','O','N','A','B','C','F','G','H','J','K','L','M','P','Q','R','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','#','$'];
    let hexChunks = [];
    let result = '';

    for (let i = 0; i < hexString.length; i += 12){
      if(hexString[i + 12]) {
        hexChunks.push(hexString.slice(i, i + 12));
      } else {
        hexChunks.push(hexString.slice(i));
      }
    }

    for (let j = 0; j < hexChunks.length; j++) {
      let n = parseInt(hexChunks[j],16);
      while (n > 0) {
        let charCode = n % 62;
        result = charSet[charCode] + result;
        n = (n-charCode) /62;
      }
    }

   return result;
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

export let createEditorModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    link(scope, element, attrs) {
      scope.dialogStyle = {};
      if (scope.editorModal.publicList && attrs.snippetPath) {
        scope.editorModal.snippetObj = scope.editorModal.publicList[attrs.snippetPath] || {};
      }
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
    },
    controllerAs: 'editorModal',
    controller: EditorCtrl,
    bindToController: true,
    template: require(`./editorModal.html`),
    url: '/editor'
  };
};
