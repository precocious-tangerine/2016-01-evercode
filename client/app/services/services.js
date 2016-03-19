import * as Actions from '../redux/actions.js';
import {convertToTree} from './fileTree.js';

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
        dispatch(Actions.setSselectedFolder(folderPath));
      },

      removeFolder(folder) {
        return this.$http({
          method: 'DELETE',
          url: '/api/folders',
          data: folder
        }).then(res => {
          dispatch(Actions.removeSnippetMap(folder.filePath));
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

export class Snippets {
  constructor($http, $ngRedux, Folders) {
    this.$http = $http;
    this.Folders = Folders;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {

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
        });
      },

      updateSnippet(snippetObj) {
        return this.$http({
          method: 'PUT',
          url: '/api/snippets',
          data: snippetObj
        }).then((res) => {
          dispatch(Actions.removeSelectedSnippet());
          this.Folders.getFileTree(res.data.filePath);
          // dispatch(Actions.addSnippetMap(filePath, snippetObj));
       });

      },

      removeSnippet(snippetObj) {
        return this.$http({
          method: 'DELETE',
          url: '/api/snippets',
          data: {snippetId: snippetObj.value.snippetId}
        }).then(() => {
          dispatch(Actions.removeSnippetMap(snippetObj.filePath));
        });
      },

      changeSelectedSnippet(snippetFilePath) {
        dispatch(Actions.setSelectedSnippet(snippetFilePath));
      },

      deselectSnippet() {
        dispatch(Actions.removeSelectedSnippet());
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
  constructor($http, $location, $window, $ngRedux) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.$http = $http;
    this.$location = $location;
    this.$window = $window;
  }
  mapDispatchToThis(dispatch) {
    return {
      signin(user) {
        return this.$http({
            method: 'POST',
            url: '/signin',
            data: user
          }).then(token => {
            this.$window.localStorage.setItem('satellizer_token', token.data);
            this.$location.path('/main');
          })
          .catch(error => {
            this.failed = false;
            console.error(error);
          });
      },

      signup(user) {
        return this.$http({
            method: 'POST',
            url: '/signup',
            data: user
          }).then(token => {
            this.$window.localStorage.setItem('satellizer_token', token.data);
            this.$location.path('/main');
          })
          .catch(error => {
            this.failed = false;
            console.error(error);
          });
      },

      isAuth() {
        return !!this.$window.localStorage.getItem('satellizer_token');
      },

      signout() {
        return this.$http({
          method: 'GET',
          url: '/signout'
        }).then(res => {
          this.$window.localStorage.removeItem('satellizer_token');
          this.$location.path('/signin');
        })
      }
    }
  }

}
