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
  }

  mapStateToThis(state) {
    let { activeUser } = state;
    return {
      activeUser
    }
  }
}