export const search = () => {
  return {
    url: '/search',
    restrict: 'E',
    controllerAs: 'search',
    controller: SearchCtrl,
    template: require('./search.html'),
    scope: {},
    access: { restricted: false }
  }
}

class SearchCtrl {
  constructor($ngRedux, Snippets, $state) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.$state = $state;
    this.Snippets = Snippets;
  }

  changeSelectedSnippet(snippetPath) {
    this.Snippets.changeSelectedSnippet(snippetPath);
  }

  mapStateToThis(state) {
    let { snippetMap } = state;
    let snippetArr = [];
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value
      if (typeof snippetVal === 'object') {
        if (snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          snippetArr.push(snippetVal);
        }
      }
    });
    return {
      snippetMap,
      snippetArr
    };
  }

};