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
    this.Snippets.updateSnippet({ snippetId: snippet._id, value: { favorite: true } });
  }

  grabAndChangeSnippet(snippetObj) {
    this.Snippets.getSnippet(snippetObj._id)
      .then(this.Snippets.changeSnippet);
  }

  mapStateToThis(state) {
    let visibleFolders = [],
      visibleSnippets = [];
    let filePath = '',
      folderName = '';
    if (state.selectedFolder.value) {
      state.selectedFolder.children.forEach(child => {
        if (typeof child.value === 'string') {
          visibleFolders.push(child);
        } else if (child.value.name !== '.config') {
          visibleSnippets.push(child);
        }
      });
      filePath = state.selectedFolder.filePath;
      folderName = state.selectedFolder.value;
    } else {
      filePath = '';
      folderName = 'No Folder Selected';
    }
    return {
      visibleSnippets,
      visibleFolders,
      filePath,
      folderName
    };
  }

}
