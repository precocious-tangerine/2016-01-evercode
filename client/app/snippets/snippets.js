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
    this.folderInput = false;
  }

  addSubFolder() {
    if(this.selectedFolder){
    let path = this.selectedFolder + '/' + this.folder.name;
    this.Folders.addFolder({ path: path });
    this.subFolder.name = '';
    }
  }

  toggleInput() {
    this.folderInput = !this.folderInput;
  }

  copySnippet(snippet) {
    this.Snippets.getSnippet({ snippetId: snippet._id });
  }

  favoriteSnippet(snippet) {
    this.Snippets.updateSnippet({ snippetId: snippet._id, value: { favorite: true } });
  }

  changeSelectedSnippet(snippetPath) {
    this.Snippets.changeSelectedSnippet(snippetPath);
  }

  removeSnippet(snippetPath) {
    this.Snippets.removeSnippet(snippetPath);
  }

  mapStateToThis(state) {
    let { selectedFolder, snippetMap } = state;
    let visibleFolders = [],
      visibleSnippets = [];
    let selectedFolderObj = snippetMap[selectedFolder];
    if (selectedFolderObj) {
      selectedFolderObj.children.forEach(childKey => {
        let child = snippetMap[childKey];
        if (typeof child.value === 'string') {
          visibleFolders.push(child);
        } else if (child.value.name !== '.config') {
          visibleSnippets.push(child);
        }
      });
    }
    return {
      visibleSnippets,
      visibleFolders,
      selectedFolderObj
    };
  }

}
