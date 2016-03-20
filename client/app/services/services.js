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

      removeFolder(folderPath) {
        return this.$http({
          method: 'DELETE',
          url: '/api/folders',
          params: { filePath: folderPath }
        }).then(response => {
          dispatch(Actions.removeSnippetMap(folderPath))
        })

        // return this.$http({
        //   method: 'DELETE',
        //   url: '/api/folders',
        //   data: folderPath
        // }).then(res => {
        // dispatch(Actions.removeSnippetMap(folderPath));
        // dispatch(Actions.removeSnippetMap(folderPath + '/.config'));
        // dispatch(Actions.removeSnippetMap(folderPath + '.config'));
        // })
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
          dispatch(Actions.setSelectedSnippet(res.data.filePath));
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
          params: { snippetId: snippetObj.value._id }
        }).then((response) => {
          // this.Folders.getFileTree();
          dispatch(Actions.removeSnippetMap(snippetObj.filePath));
          dispatch(Actions.removeSelectedSnippet());
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
          }).then((res) => {
            this.$window.localStorage.setItem('satellizer_token', res.data.token);
            dispatch(Actions.setActiveUser(res.data.user));
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
        });
      },

      addUserInfo(user){
        dispatch(Actions.setActiveUser(user));
      },

      isAuth() {
        return !!this.$window.localStorage.getItem('satellizer_token');
      },

      signout() {
        this.$window.localStorage.removeItem('satellizer_token');
        dispatch(Actions.removeActiveUser());
        this.$location.path('/signin');
      }
    }
  }

}
