export const createAuthCtrl = (url) => {
  return {
    url: url,
    controllerAs: 'authCtrl',
    controller: AuthCtrl,
    template: require(`.${url}.html`),
    scope: {},
    access: { restricted: false }
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
        .then(token => {
          this.$window.localStorage.setItem('com.evercode', token);
          this.$location.path('/main');
        })
        .catch(error => {
          this.failed = false;
          console.error(error);
        });
    }
  }


  signup(boolean) {
    this.failed = true;
    if (boolean) {
      this.Auth.signup(this.user)
        .then(token => {
          console.log(token);
          console.log(this);
          this.$window.localStorage.setItem('com.evercode', token);
          console.log('token is set');
          this.$location.path('/main');
        })
        .catch(error => {
          this.failed = false;
          console.error(error);
        });
    }
  }

}
