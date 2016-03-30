class AuthCtrl {
  constructor(Auth) {
    this.user = {};
    this.failed = false;
    this.Auth = Auth;
  }
  githubAuth() {
    this.failed = false;
    this.Auth.githubSignin();
    this.hideModal();
  }
  hideModal() {
    this.show = false;
  }
  switch() {
    this.show = false;
    this.other = true;
  }
  signin(boolean) {
    this.failed = false;
    if (boolean) {
      this.Auth.signin(this.user);
      this.hideModal();
    }
  }
  signup(boolean) {
    this.failed = false;
    if (boolean && this.user.passwordConfirm === this.user.password) {
      this.Auth.signup(this.user);
      this.hideModal();
    } else {
      this.failed = true;
    }
  }
}

export let createAuthModal = (url) => {
  return () => {
    return {
      restrict: 'E',
      scope: {
        show: '=',
        other: '='
      },
      replace: true,
      link(scope, element, attrs) {
        scope.dialogStyle = {};
        if(attrs.width) {
          scope.dialogStyle.width = attrs.width;
        }
        if(attrs.height) {
          scope.dialogStyle.height = attrs.height;
        }
      },
      controllerAs: 'authCtrl',
      controller: AuthCtrl,
      bindToController: true,
      template: require(`.${url}.html`),
      url: url
    };
  };
};

