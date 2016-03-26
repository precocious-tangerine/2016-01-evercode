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
  constructor($ngRedux, $state, Auth) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.Auth = Auth;
    this.cmThemes = ['eclipse', 'twilight', '3024-day', 'ambiance', 'cobalt', 'material', 'mdn-like', 'paraiso-light', 'rubyblue', 'yeti', 'zenburn'];
    this.cmLanguages = ['javascript', 'python', 'clike', 'ruby', 'php', 'sql', 'css', 'htmlmixed']
  }

  changeTheme(theme) {
    this.Auth.updateUser({ theme: theme });
  }

  changeLanguage(language) {
    this.Auth.updateUser({ language: language });
  }

  mapStateToThis(state) {
    let { activeUser } = state;
    let userTheme = activeUser.theme ? activeUser.theme : 'eclipse';
    let userLanguage = activeUser.language ? activeUser.language : 'javascript';
    return {
      activeUser,
      userTheme,
      userLanguage
    }
  }
}