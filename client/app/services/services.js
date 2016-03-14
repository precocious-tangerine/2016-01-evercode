import * as Actions from '../redux/actions.js';

export class Folders {
  constructor($http, ngRedux) {
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {
      getFileTree() {
        return this.$http({
          method: 'GET',
          url: '/api/fileTree'
        }).then(res => {
          dispatch(setFileTree(res.data.tree));
        })
      },

      addFolder(folder) {
        return this.$http({
          method: 'POST',
          url: '/folders',
          data: folder
        }).then(res => {
          this.getFileTree();
        })
      },

      removeFolder(folder) {
        return this.$http({
          method: 'POST',
          url: '/folders/remove',
          data: folder
        }).then(res => {
          this.getFileTree();
        })
      }
    }
  }
}

export class Snippets {
  constructor($http) {
    this.$http = $http;
  }

  addSnippet(snippet) {
      return this.$http({
        method: 'POST',
        url: '/snippets',
        data: snippet
      });
  }

  updateSnippet(name, value) {
      return this.$http({
        method: 'PUT',
        url: '/snippets',
        data: {name, value}
      });
  }

  removeSnippet(snippet) {
      return this.$http({
        method: 'POST',
        url: '/snippets/remove',
        data: snippet
      });
  }
}

export class Auth {
  constructor($http, $location, $window, Folders) {
    this.$http = $http;
    this.$location = $location;
    this.$window = $window;
  }
  signin(user) {
    return this.$http({
      method: 'POST',
      url: '/signin',
      data: user
    })
  }
  signup(user) {
    return this.$http({
      method: 'POST',
      url: '/signup',
      data: user
    })
  }

  isAuth() {
    return !!this.$window.localStorage.getItem('com.evercode');
  }

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
