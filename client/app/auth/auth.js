
export const createAuthCtrl = (url) => {
  return {
    url: url,
    controllerAs: 'authCtrl',
    controller: AuthCtrl,
    template: require('./signin.html'),
    scope: {}
  }
}


class AuthCtrl {
  constructor($scope, $location, $window, Auth) {
  this.user = {};
  this.failed = true;
  }
  
  signin(boolean) {
    this.failed = true;
    // if (boolean) {
      // Auth.signin($scope.user)
      //   .then(function(token) {
      //     $window.localStorage.setItem('com.evercode', token);
      //     $location.path('/main');
      //   })
      //   .catch(function(error) {
      //     $scope.failed = false;
      //     console.error(error);
      //   });
      //}
  }
  

  signup(boolean) {
    this.failed = true;
    // if (boolean) {
    //   Auth.signup($scope.user)
    //     .then(function(token) {
    //       $window.localStorage.setItem('com.evercode', token);
    //       $location.path('/main');
    //     })
    //     .catch(function(error) {
    //       $scope.failed = false;
    //       console.error(error);
    //     });
    // }
  }

}
