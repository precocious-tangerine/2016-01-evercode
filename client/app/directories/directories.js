angular.module('evercode.directories', [])

.controller('DirectoriesCtrl', function($scope, $rootScope, Folders, $location) {
  $scope.data = {};
  $scope.data.folders = [{name: 'React'}];
  $scope.folder = {};

  $scope.initialize = function() {
    Folders.getFolders().then(function(data) {
      $scope.data.folders = data;
    });
  };

  $scope.addFolder = function() {
    $scope.toggleInput();
    Folders.addFolder({ name: $scope.folder.name })
      .then(function(res) {
        $scope.initialize();
      });
    $scope.folder.name = '';
    
  };

  $scope.changeTab = function(tabName){
    if($rootScope.deleteMode){
      Folders.removeFolder({name: tabName})
      .then(function(res){
        $scope.initialize();
        $rootScope.deleteMode = false;
        $location.path('/bookmarks');
      });
    } else {
      $rootScope.activeTab = tabName;
    }
  };

  $scope.deleteMode = function() {
    $rootScope.deleteMode = !$rootScope.deleteMode;
  };
  
  // $scope.initialize();
});
