export const createAuthCtrl = (url) => {
  return {
    url: url,
    controllerAs: 'authCtrl',
    controller: AuthCtrl,
    template: require(`.${url}.html`),
    scope: {},
    access: {restricted: false}
  }
}

class AuthCtrl {
  constructor($location, $window, Auth) {
  this.user = {};
  this.failed = true;
  this.$location = $location;
  this.$window = $window;
  this.Auth = Auth;
  }
  
  signin(boolean) {
    this.failed = true;
    if (boolean) {
      this.Auth.signin(this.user)
        .then(function(token) {
          console.log('token', token);
          this.$window.localStorage.setItem('com.evercode', token);
          this.$location.path('/main');
        })
        .catch(function(error) {
          this.failed = false;
          console.error(error);
        });
      }
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
