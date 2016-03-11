angular.module('evercode.services', [])

.factory('Folders', function($http) {

    var getFolders = function() {
      return $http({
        method: 'GET',
        url: 'api/folders'
      }).then(function(res) {
        return res.data;
      });
    };

    var addFolder = function(list) {
      return $http({
        method: 'POST',
        url: 'api/folders',
        data: list
      });
    };

    var removeFolder = function(list) {
      return $http({
        method: 'POST',
        url: 'api/folders/remove',
        data: list
      });
    };

    return {
      getFolders: getFolders,
      addFolder: addFolder,
      removeFolder: removeFolder
    };
  })
  .factory('Auth', function($http, $location, $window) {

    var signin = function(user) {
      return $http({
        method: 'POST',
        url: '/api/signin',
        data: user
      })
    };

    var signup = function(user) {
      return $http({
        method: 'POST',
        url: '/api/signup',
        data: user
      })
    };

    var isAuth = function () {
      return !!$window.localStorage.getItem('com.shortly');
    };

    var signout = function() {
      return $http({
        method: 'GET',
        url: '/api/signout'
      }).then(function() {
        $window.localStorage.removeItem('com.evercode');
        $location.path('/signin');
      })
    };

    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      signout: signout
    };
  });
