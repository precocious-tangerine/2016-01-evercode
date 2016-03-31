class SearchCtrl {
  constructor($ngRedux, Snippets, focus) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.Snippets = Snippets;
    focus('search-input');
  }

  changeSelectedSnippet(snippetPath) {
    this.Snippets.changeSelectedSnippet(snippetPath);
  }
  
  hasTag(snippetTag, searchTag) {
    return !!snippetTag.includes(searchTag);
  }

  mapStateToThis(state) {
    let { snippetMap } = state;
    let snippetArr = [];
    let tags = {};
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value;
      if (typeof snippetVal === 'object') {
        if (snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          snippetArr.push(snippetVal);
          snippetVal.tags.forEach(tag => {
            tags[tag] = tags[tag] || [];
            tags[tag].push(snippetVal);
          });
        }
      }
    });
    return {
      snippetMap,
      snippetArr,
      tags
    };
  }

}

export const search = () => {
  return {
    url: '/search',
    restrict: 'E',
    controllerAs: 'search',
    controller: SearchCtrl,
    template: require('./search.html'),
    scope: {},
    access: { restricted: true }
  };
};

