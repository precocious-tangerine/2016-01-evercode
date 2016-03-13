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
  constructor($scope, $location, $window, Auth) {
  this.user = {};
  this.failed = true;
  this.Auth = Auth;
  this.$location = $location;
  this.$window = $window;
  }

  signin(boolean) {
    this.failed = true;
    if (boolean) {
      this.Auth.signin(this.user);
    }
  }

  signup(boolean) {
    this.failed = true;
    if (boolean) {
      this.Auth.signup(this.user);

    }
  }

}
