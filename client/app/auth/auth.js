angular.module('evercode.auth', [])

.controller('AuthCtrl', function($scope, $location, Auth, $window) {
  $scope.user = {};
  $scope.failed = true;

  $scope.signin = function(boolean) {
    if (boolean) {
      Auth.signin($scope.user)
        .then(function(token) {
          $window.localStorage.setItem('com.evercode', token);
          $location.path('/snippets');
        })
        .catch(function(error) {
          $scope.failed = false;
          console.error(error);
        });
    }
  };

  $scope.signup = function(boolean) {
    if (boolean) {
      Auth.signup($scope.user)
        .then(function(token) {
          $window.localStorage.setItem('com.evercode', token);
          $location.path('/evercode');
        })
        .catch(function(error) {
          $scope.failed = false;
          console.error(error);
        });
    }
  };

});
