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
          .catch(error => {
            console.error(error);
          });
      },

      addFolder(folder) {
        return this.$http({
            method: 'POST',
            url: '/api/folders',
            data: folder
          }).then(snippet => {
            dispatch(Actions.addSnippetMap(snippet.data.filePath, snippet.data));
          })
          .catch(error => {
            console.error(error);
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
          .catch(error => {
            console.error(error);
          });
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
  constructor($http, $ngRedux, Folders, Auth) {
    this.$http = $http;
    this.Folders = Folders;
    this.Auth = Auth;
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
          })
          .catch(error => {
            console.error(error);
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
            dispatch(Actions.addSnippetMap(res.data.filePath, res.data));
            dispatch(Actions.setSelectedSnippet(res.data.filePath));
            Materialize.toast('Snippet added!', 3000, 'rounded');
          })
          .catch(error => {
            console.error(error);
          });
      },

      updateSnippet(snippetObj, oldFilePath) {
        return this.$http({
            method: 'PUT',
            url: '/api/snippets',
            data: snippetObj
          }).then(res => {
            let nodeToPass = Object.assign({}, snippetObj, { value: res.data });
            Materialize.toast('Snippet updated!', 3000, 'rounded');
            dispatch(Actions.updateSnippetMap(oldFilePath, res.data.filePath, nodeToPass));
          })
          .catch(error => {
            console.error(error);
          });

      },

      removeSnippet(snippetObj) {
        return this.$http({
            method: 'DELETE',
            url: '/api/snippets',
            params: { snippetId: snippetObj.value._id }
          }).then((response) => {
            this.deselectSnippet();
            dispatch(Actions.removeSnippetMap(snippetObj.filePath));
            Materialize.toast('Successfully removed!', 3000, 'rounded');
          })
          .catch(error => {
            console.error(error);
          });
      },

      changeSelectedSnippet(snippetFilePath) {
        dispatch(Actions.setSelectedSnippet(snippetFilePath));
        this.Auth.updateUser({ selectedSnippet: snippetFilePath });
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
          .catch(error => {
            console.error(error);
          });
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
  constructor($http, $state, $auth, $ngRedux, Folders) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.$http = $http;
    this.$state = $state;
    this.Folders = Folders;
    this.$auth = $auth;
  }
  mapDispatchToThis(dispatch) {
    return {
      signin(user) {
        return this.$http({
            method: 'POST',
            url: '/signin',
            data: user
          }).then((res) => {
            this.$auth.setToken(res.data.token);
            this.getUserInfo();
            this.Folders.getFileTree();
            $('#snippets-modal').closeModal({
              dismissible: true,
              complete: () => {
                $('.lean-overlay').remove();
              }
            });
            Materialize.toast('Successfully signed in!', 5000, 'rounded');
            this.$state.go('main.editor');
          })
          .catch(error => {
            console.error(error);
          });
      },

      githubSignin() {
        this.$auth.authenticate('github')
          .then((res) => {
            this.getUserInfo();
            this.Folders.getFileTree();
            Materialize.toast('Successfully signed in!', 5000, 'rounded');
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
        })
        .then(res => {
          Materialize.toast('Success! Check your e-mail for verification', 4000, 'rounded', () => {
            this.$state.go('main.signin');
          })
        })
        .catch(error => {
          this.failed = false;
          console.error(error);
        });
      },

      getUserInfo() {
        return this.$http({
            method: 'GET',
            url: '/api/userInfo'
          }).then(res => {
            dispatch(Actions.setActiveUser(res.data));
            res.data.selectedSnippet ? dispatch(Actions.setSelectedSnippet(res.data.selectedSnippet)) : null;
          })
          .catch(error => {
            console.error(error);
          });
      },

      updateUser(userObj) {
        return this.$http({
            method: 'PUT',
            url: '/api/userInfo',
            data: userObj
          }).then(res => {
            dispatch(Actions.setActiveUser(res.data));
          })
          .catch(error => {
            console.error(error);
          });
      },

      signout() {
        this.$auth.logout();
        dispatch(Actions.removeActiveUser());
      }
    }
  }
}