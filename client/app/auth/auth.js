export let createSigninModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    link(scope, element, attrs) {
      scope.dialogStyle = {};
      attrs.width ? scope.dialogStyle.width = attrs.width : null;
      attrs.height ? scope.dialogStyle.height = attrs.height : null;
      scope.hideModal = () => scope.authCtrl.show = false;
    },
    controllerAs: 'authCtrl',
    controller: AuthCtrl,
    bindToController: true,
    template: require('./signin.html')
  }
}

export let createSignupModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    link(scope, element, attrs) {
      window.signupModal = scope;
      scope.dialogStyle = {};
      attrs.width ? scope.dialogStyle.width = attrs.width : null;
      attrs.height ? scope.dialogStyle.height = attrs.height : null;
      scope.hideModal = () => scope.authCtrl.show = false;
    },
    controllerAs: 'authCtrl',
    controller: AuthCtrl,
    bindToController: true,
    template: require('./signup.html')
  }
}

class AuthCtrl {
  constructor(Auth) {
    this.user = {};
    this.failed = false;
    this.Auth = Auth;
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