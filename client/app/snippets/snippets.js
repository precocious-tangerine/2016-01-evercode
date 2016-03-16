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
    $ngRedux.connect(this.mapStateToThis)(this);
    this.Folders = Folders;
    this.Snippets = Snippets;
    Folders.testSelectedFolder();
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
    let {selectedFolder, snippetMap} = state;
    let visibleFolders = [], visibleSnippets = [];
    let filePath = '', folderName = '';
    let selectedFolderObj = snippetMap[selectedFolder];
    if (selectedFolderObj) {
      selectedFolderObj.children.forEach(childKey => {
        let child = snippetMap[childKey];
        if (typeof child === 'string') {
          visibleFolders.push(child);
        } else if (child.value.name !== '.config') {
          visibleSnippets.push(child);
        }
      });
      filePath = selectedFolder
      folderName = selectedFolderObj.value;
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
