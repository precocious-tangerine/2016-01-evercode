import * as Actions from '../redux/actions.js';

export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require('./snippets.html'),
    access: { restricted: true }
  };
}

class SnippetsCtrl {
  constructor($ngRedux, Snippets, Folders) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.Folders = Folders;
    this.Snippets = Snippets;
  }
  copySnippet(snippet) {
    this.Snippets.getSnippet({ snippetId: snippet._id });
  }

  favoriteSnippet(snippet) {
    this.Snippets.updateSnippet({ snippetId: snippet._id, value: {favorite: true} });
  }

  grabAndChangeSnippet(snippetObj) {
    this.Snippets.getSnippet(snippetObj._id)
    .then(this.Snippets.changeSnippet);
  }

  mapStateToThis(state) {
    const visibleFolders = !state.selectedFolder ? null : state.selectedFolder.children.filter(function(element){
      return typeof element.value === 'string' 
    });
    const visibleSnippets = !state.selectedFolder ? null : state.selectedFolder.children.filter(function(element){
      return typeof element.value !== 'string' && element.value.name !== '.config'
    })

    return {
      visibleSnippets,
      visibleFolders
    };
  }
  
}
