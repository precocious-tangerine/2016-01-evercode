import * as Actions from '../redux/actions.js';

export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require(`.${url}.html`),
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

  addFolder() {
      let path = this.selectedFolder + '/' + this.subFolder.name;
      this.Folders.addFolder({ path: path });
      this.subFolder.name = '';
  }

  removeFolder(folderPath) {
    this.Folders.removeFolder(folderPath);
  }

  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
  }

  toggleFolderNameInput() {
    this.folderInput = !this.folderInput;
  }

  copySnippet(snippet) {
    this.Snippets.getSnippet({ snippetId: snippet._id });
  }

  toggleFavorite(snippet) {
    let _id = snippet.value._id;
    let favorite = !snippet.value.favorite;
    this.Snippets.updateSnippet({ snippetId: _id, value: { favorite: favorite } }, snippet.filePath);
  }

  changeSelectedSnippet(snippetPath) {
    this.Snippets.changeSelectedSnippet(snippetPath);
  }

  deselectSnippet() {
    this.Snippets.deselectSnippet();
  }

  removeSnippet(snippetObj) {
    this.Snippets.removeSnippet(snippetObj);
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
      selectedFolderObj,
      selectedFolder
    };
  }

}
