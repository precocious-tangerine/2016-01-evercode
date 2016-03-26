export const publicPage = () => {
  return {
    url: '/public',
    restrict: 'E',
    controllerAs: 'public',
    controller: PublicCtrl,
    template: require('./public.html'),
    scope: {},
    access: { restricted: false }
  }
}

class PublicCtrl {
  constructor($ngRedux, $state, Public) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.Public = Public;
    this.snippetList = [];
    this.loading = true;
    this.Public.getPublicSnippets().then(res => {
      this.loading = false;     
    });
  }

  openSnippet(filepath) {
    this.Public.setSelectedPublicSnippet(filepath);
    this.$state.go('main.editor');
  }

  mapStateToThis(state) {
    let { publicList, selectedPublicSnippet } = state;
    let snippetArr = Object.keys(publicList).map(key => {
      return publicList[key]
    })
    return {
      publicList,
      snippetArr,
      selectedPublicSnippet
    }
  }
}
