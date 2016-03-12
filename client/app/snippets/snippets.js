angular.module('evercode.snippets', [])

.controller('SnippetsCtrl', function($scope) {

  $scope.data = {};
  $scope.data.snippets = [{name: 'redux'}];
  $scope.snippet = {};

  $scope.favorite = function() {
  };

  $scope.copy = function() {
  };

});