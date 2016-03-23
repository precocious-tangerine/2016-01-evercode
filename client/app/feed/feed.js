export const feed = () => {
  return {
    url: '/feed',
    restrict: 'E',
    controllerAs: 'feed',
    controller: PublicCtrl,
    template: require('./feed.html'),
    scope: {},
    access: { restricted: false }
  }
}

class PublicCtrl {
  constructor($ngRedux) {
    $ngRedux.connect(this.mapStateToThis)(this);
  }

  mapStateToThis(state) {

    return {

    };
  }
}
