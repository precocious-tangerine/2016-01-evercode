import * as Actions from '../redux/actions.js';
import convertToTree from './fileTree.js';


export class Folders {
  constructor($http, $ngRedux) {
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {
      getFileTree() {
        return this.$http({
          method: 'GET',
          url: '/api/user/snippets'
        }).then(res => {
          dispatch(Actions.setFileTree(res.data.tree));
        })
      },

      getTestFileTree() {
        return this.$http({
          method: 'GET',
          url: 'api/test-folder-tree'
        }).then(res => {
          dispatch(Actions.setFileTree(convertToTree(res.data)));
        })
      },

      addFolder(folder) {
        return this.$http({
          method: 'POST',
          url: '/api/folders',
          data: folder
        }).then(res => {
          this.getFileTree();
        })
      },

      selectFolder(folder) {
        dispatch(Actions.setSselectedFolder(folder));
      },

      removeFolder(folder) {
        return this.$http({
          method: 'DELETE',
          url: '/api/folders',
          data: folder
        }).then(res => {
          this.getFileTree();
        })
      }
    }
  }
}

export class Snippets {
  constructor($http, $ngRedux) {
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {

      getSnippet(snippetId) {
        return this.$http({
          method: 'GET',
          url: '/api/snippets?snippetId=' + snippetId
        });
      },

      addSnippet(snippet) {
        return this.$http({
          method: 'POST',
          url: '/api/snippets',
          data: snippet
        });
      },

      updateSnippet(snippetId, value) {
        return this.$http({
          method: 'PUT',
          url: '/api/snippets',
          data: { snippetId, value }
        });
      },

      removeSnippet(snippetId) {
        return this.$http({
          method: 'DELETE',
          url: '/api/snippets',
          data: { snippetId }
        });
      },

      changeSnippet(snippetObj) {
        dispatch(Actions.setSelectedSnippet(snippetObj));
      }
    }
  }
}

export class Auth {
  constructor($http, $location, $window, Folders, $ngRedux) {
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
            this.$window.localStorage.setItem('com.evercode', token);
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
            console.log(token);
            this.$window.localStorage.setItem('com.evercode', token);
            this.$location.path('/main');
          })
          .catch(error => {
            this.failed = false;
            console.error(error);
          });
      },

      isAuth() {
        return !!this.$window.localStorage.getItem('com.evercode');
      },

      signout() {
        return this.$http({
          method: 'GET',
          url: '/signout'
        }).then(function() {
          this.$window.localStorage.removeItem('com.evercode');
          this.$location.path('/signin');
        })
      }
    }
  }

}
