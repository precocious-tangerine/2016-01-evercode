angular.module('evercode.auth', [])

.controller('AuthController', function ($scope, $location, Auth) {
  $scope.user = {};
  $scope.failed = true;

  $scope.signin = function (boolean) {
    if (boolean) {
      Auth.signin($scope.user);
    }
  };

  $scope.signup = function (boolean) {
    if (boolean) {
      Auth.signup($scope.user)
    }
  };

});
