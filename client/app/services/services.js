import * as Actions from '../redux/actions.js';
import { convertToTree, getAllChildren } from './fileTree.js';

export class Folders {
  constructor($http, $ngRedux) {
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {
      getFileTree(snippetPath) {
        return this.$http({
          method: 'GET',
          url: '/api/user/snippets'
        }).then(res => {
          var snippetMap = convertToTree(res.data);
          dispatch(Actions.setSnippetMap(snippetMap));
          this.selectedFolder ? null : dispatch(Actions.setSelectedFolder('/' + this.email));
          snippetPath ? dispatch(Actions.setSelectedSnippet(snippetPath)) : null;
        })
      },

      addFolder(folder) {
        return this.$http({
          method: 'POST',
          url: '/api/folders',
          data: folder
        }).then(snippet => {
          dispatch(Actions.addSnippetMap(snippet.data.filePath, snippet.data));
        });
      },

      selectFolder(folderPath) {
        dispatch(Actions.setSelectedFolder(folderPath));
      },

      removeFolder(folderPath) {
        return this.$http({
          method: 'DELETE',
          url: '/api/folders',
          params: { filePath: folderPath }
        }).then(response => {
          dispatch(Actions.removeSnippetMap(folderPath))
        })
      }
    }
  }

  mapStateToThis(state) {
    return {
      snippetMap: state.snippetMap,
      selectedFolder: state.selectedFolder,
      selectedSnippet: state.selectedSnippet,
      email: state.activeUser.email
    };
  }
}

export class Snippets {
  constructor($http, $ngRedux, Folders) {
    this.$http = $http;
    this.Folders = Folders;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {

      getPublicSnippets() {
        return this.$http({
          method: 'GET',
          url: '/snippets'
        }).then(res => {
          return res;
        });
      },

      getSnippet(snippetId) {
        return this.$http({
          method: 'GET',
          url: '/api/snippets?_id=' + snippetId
        });
      },

      addSnippet(snippetObj) {
        let { filePath } = snippetObj
        return this.$http({
          method: 'POST',
          url: '/api/snippets',
          data: snippetObj
        }).then((res) => {
          Materialize.toast('Snippet added!', 3000, 'rounded');
          dispatch(Actions.addSnippetMap(res.data.filePath, res.data));
          dispatch(Actions.setSelectedSnippet(res.data.filePath));
        });
      },

      updateSnippet(snippetObj, oldFilePath) {
        return this.$http({
          method: 'PUT',
          url: '/api/snippets',
          data: snippetObj
        }).then((res) => {
          Materialize.toast('Snippet updated!', 3000, 'rounded');
          dispatch(Actions.updateSnippetMap(oldFilePath, res.data.filePath, snippetObj));
        });

      },

      removeSnippet(snippetObj) {
        return this.$http({
          method: 'DELETE',
          url: '/api/snippets',
          params: { snippetId: snippetObj.value._id }
        }).then((response) => {
          this.deselectSnippet();
          Materialize.toast('Successfully removed!', 3000, 'rounded');
          dispatch(Actions.removeSnippetMap(snippetObj.filePath));
        });
      },

      changeSelectedSnippet(snippetFilePath) {
        dispatch(Actions.setSelectedSnippet(snippetFilePath));
      },

      deselectSnippet() {
        dispatch(Actions.removeSelectedSnippet());
      },

      addAnnotation(annotationObj) {
        return this.$http({
          method: 'POST',
          url: '/api/annotations',
          data: annotationObj
        }).then(response => {
          console.log('addAnnotation HTTP response: ', response);
        })
      }
    }
  }
  mapStateToThis(state) {
    return {
      snippetMap: state.snippetMap,
      selectedFolder: state.selectedFolder,
      selectedSnippet: state.selectedSnippet,
    };
  }

}

export class Auth {
  constructor($http, $state, $window, $ngRedux, Folders) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.$http = $http;
    this.$state = $state;
    this.$window = $window;
    this.Folders = Folders;
  }
  mapDispatchToThis(dispatch) {
    return {
      signin(user) {
        return this.$http({
            method: 'POST',
            url: '/signin',
            data: user
          }).then((res) => {
            this.$window.localStorage.setItem('satellizer_token', res.data.token);
            this.getUserInfo();
            this.Folders.getFileTree();
            this.$state.go('main.editor');
          })
          .catch(error => {
            console.error(error);
          });
      },

      signup(user) {
        return this.$http({
          method: 'POST',
          url: '/signup',
          data: user
        });
      },

      getUserInfo() {
        return this.$http({
            method: 'GET',
            url: '/api/userInfo'
          }).then(res => {
            dispatch(Actions.setActiveUser(res.data));
          })
          .catch(error => {
            console.error(error);
          });
      },

      isAuth() {
        return !!this.$window.localStorage.getItem('satellizer_token');
      },

      signout() {
        this.$window.localStorage.removeItem('satellizer_token');
        dispatch(Actions.removeActiveUser());
      }
    }
  }

}