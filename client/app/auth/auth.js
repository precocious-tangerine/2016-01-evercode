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
    this.failed = true;
    // this.success 
    this.Auth = Auth;
    this.$auth = $auth;
    this.$state = $state;
    this.Folders = Folders;
  }

  githubAuth() {
    this.$auth.authenticate('github').then((res) => {
      this.Auth.getUserInfo();
      this.Folders.getFileTree();
      Materialize.toast('Successfully signed in!', 5000, 'rounded');
      this.$state.go('main.editor');
    })
  }

  signin(boolean) {
    this.failed = true;
    if (boolean) {
      this.Auth.signin(this.user);
    }
  }

  signup(boolean) {
    this.failed = true;
    if (boolean && this.user.passwordConfirm === this.user.password) {
      this.Auth.signup(this.user)
        .then(res => {
          Materialize.toast('Success! Check your e-mail for verification', 5000, 'rounded', () => {
            this.$state.go('main.signin');
          })
        })
        .catch(error => {
          this.failed = false;
          console.error(error);
        });
    } else {
      this.failed = false;
    }
  }

}