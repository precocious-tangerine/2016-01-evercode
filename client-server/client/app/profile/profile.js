export const profile = () => {
  return {
    url: '/profile',
    restrict: 'E',
    controllerAs: 'profile',
    controller: ProfileCtrl,
    template: require('./profile.html'),
    scope: {},
    access: { restricted: true }
  }
}

class ProfileCtrl {
  constructor($ngRedux, $state, Auth, Snippets) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.Auth = Auth;
    this.Snippets = Snippets;
    this.cmThemes = ['eclipse', 'twilight', '3024-day', 'ambiance', 'cobalt', 'material', 'mdn-like', 'paraiso-light', 'rubyblue', 'yeti', 'zenburn'];
    this.cmLanguages = ['javascript', 'python', 'clike', 'ruby', 'php', 'sql', 'css', 'htmlmixed'];
  }

  changeUsername(email, username) {
    this.Snippets.updateUsername({ email, username });
  }

  changeTheme(theme) {
    this.Auth.updateUser({ theme });
  }

  changeLanguage(language) {
    this.Auth.updateUser({ language });
  }

  changePassword() {
    if(this.user.newPass === this.user.confirmPass){
      this.Auth.updatePassword({ email: this.activeUser.email, password: this.user.currentPass, newPassword: this.user.newPass });
    } else {
      Materialize.toast("New passwords don't match!", 3000, 'rounded');
    }
  }

  mapStateToThis(state) {
    let { activeUser } = state;
    let username = activeUser.username;
    let userTheme = activeUser.theme ? activeUser.theme : 'eclipse';
    let userLanguage = activeUser.language ? activeUser.language : 'javascript';
    return {
      activeUser,
      userTheme,
      userLanguage,
      username
    }
  }
}