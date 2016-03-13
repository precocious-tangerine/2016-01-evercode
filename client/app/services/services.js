export class Folders {
  constructor($http) {
    this.$http = $http;
  }
  getFolders() {
      return this.$http({
        method: 'GET',
        url: '/folders'
      }).then(function(res) {
        return res.data;
      });
  }

  addFolder(list) {
      return this.$http({
        method: 'POST',
        url: '/folders',
        data: list
      });
  }

  removeFolder(list) {
      return this.$http({
        method: 'POST',
        url: '/folders/remove',
        data: list
      });
  }
}
export class Auth { 
  constructor($http, $location, $window) {
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