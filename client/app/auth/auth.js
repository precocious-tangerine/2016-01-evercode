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
  constructor($auth, $state, Auth, Folders) {
    this.user = {};
    this.failed = false;
    this.Auth = Auth;
    this.$auth = $auth;
    this.$state = $state;
    this.Folders = Folders;
  }

  githubAuth() {
    this.failed = false;
    this.Auth.githubSignin();
  }

  signin(boolean) {
    this.failed = false;
    if (boolean) {
      this.Auth.signin(this.user);
    }
  }

  signup(boolean) {
    this.failed = false;
    if (boolean && this.user.passwordConfirm === this.user.password) {
      this.Auth.signup(this.user);
    } else {
      this.failed = true;
    }
  }

}