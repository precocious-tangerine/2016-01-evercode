export const createAuthCtrl = (url) => {
    return {
        url: url,
        controllerAs: 'authCtrl',
        controller: AuthCtrl,
        template: require(`.${url}.html`),
        scope: {},
        access: {
            restricted: false
        }
    }
}

class AuthCtrl {
    constructor(Auth, $auth, $state) {
        this.user = {};
        this.failed = true;
        this.Auth = Auth;
        this.$auth = $auth;
        this.$state = $state;
    }

  githubAuth() {
    this.$auth.authenticate('github').then((res) => {
      this.Auth.addUserInfo(res.data.user);
      this.$state.go('main');
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
      if (boolean) {
          this.Auth.signup(this.user)
              .then(res => {
                  console.log('signed up');
                  // modal with message to check email
              })
              .catch(error => {
                  this.failed = false;
                  console.error(error);
              });
      }
  }

}
