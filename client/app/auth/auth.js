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
  constructor($location, $window, Auth, Folders) {
  this.user = {};
  this.failed = true;
  this.$location = $location;
  this.$window = $window;
  this.Auth = Auth;
  this.Folders = Folders;
  }
  
  signin(boolean) {
    this.failed = true;
    if (boolean) {
      this.Auth.signin(this.user)
        .then(token => {
          console.log('token', token);
          this.$window.localStorage.setItem('com.evercode', token);
          this.Folders.getFileTree().then
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
