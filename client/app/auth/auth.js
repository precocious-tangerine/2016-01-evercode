angular.module('evercode.auth', [])

.controller('AuthCtrl', function($scope, $location, Auth, $window) {
  $scope.user = {};
  $scope.failed = true;

  $scope.signin = function(boolean) {
    $scope.failed = true;
    if (boolean) {
      Auth.signin($scope.user)
        .then(function(token) {
          $window.localStorage.setItem('com.evercode', token);
          $location.path('/main');
        })
        .catch(function(error) {
          $scope.failed = false;
          console.error(error);
        });
    }
  };

  $scope.signup = function(boolean) {
    $scope.failed = true;
    if (boolean) {
      Auth.signup($scope.user)
        .then(function(token) {
          $window.localStorage.setItem('com.evercode', token);
          $location.path('/main');
        })
        .catch(function(error) {
          $scope.failed = false;
          console.error(error);
        });
    }
  };

});
