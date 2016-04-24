import { getAllFoldersPaths } from '../../../services/fileTree.js';

class SnippetsCtrl {
  constructor($ngRedux, Snippets, Folders, Public, $state, focus) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.Public = Public;
    this.Folders = Folders;
    this.Snippets = Snippets;
    this.folderInput = false;
    this.folderModalShow = false;
    this.moveModalShow = false;
    this.folderModal = {};
    this.moveModal = {};
    this.$state = $state;
    this.focus = focus;
  }

  focusNameInput(filePath) {
    this.changeSelectedSnippet(filePath);
    this.focus('snippet-input-name');
  }

  toggleFolderModal(folderObj) {
    this.folderModal = folderObj;
    this.folderModalShow = !this.folderModalShow;
  }

  toggleMoveModal(snippetObj) {
    this.paths = getAllFoldersPaths(this.snippetMap, this.snippetMap.__root.filePath);
    this.moveModal = snippetObj;
    this.moveModalShow = !this.moveModalShow;
  }

  addFolder() {
    let path = this.selectedFolder + '/' + this.subFolder.name;
    if (!this.snippetMap[path]) {
      this.Folders.addFolder({ path: path });
      this.subFolder.name = '';
    } else {
      Materialize.toast('Can not use duplicate name', 3000, 'rounded');
    }
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
    let _id = snippet.value ? snippet.value._id : snippet._id;
    let favorite = snippet.value ? !snippet.value.favorite : !snippet.favorite;
    this.Snippets.updateSnippet({ _id, favorite }, snippet.filePath);
  }
  changeSelectedSnippet(snippetPath) {
    if (this.selectedPublicSnippet) {
      if (this.selectedPublicSnippet !== snippetPath) {
        this.Public.setSelectedPublicSnippet(snippetPath);
      }
    } else {
      if (this.selectedSnippet !== snippetPath) {
        this.Snippets.changeSelectedSnippet(snippetPath);
      }
    }
  }
  deselectSnippet() {
    this.Public.removeSelectedPublicSnippet();
    this.Snippets.deselectSnippet();
    this.focus('snippet-input-name');
  }
  removeSnippet(snippetObj) {
    this.Snippets.removeSnippet(snippetObj);
  }

  closeSideNav() {
    this.$state.go('main.editor');
  }

  showToolbar(id) {
    $('#' + id).toggle(400);
    $('.tooltipped').tooltip({ delay: 50 });
  }

  mapStateToThis(state) {
    let { selectedFolder, snippetMap, selectedSnippet, selectedPublicSnippet, publicList } = state;
    let visibleFolders = [],
      visibleSnippets = [];
    let selectedFolderObj = snippetMap[selectedFolder];
    if (selectedPublicSnippet) {
      visibleSnippets = publicList;
    } else if (selectedFolderObj) {
      selectedFolderObj.children.forEach(childKey => {
        let child = snippetMap[childKey];
        if (typeof child.value === 'string') {
          visibleFolders.push(child);
        } else if (child.value.name !== '.config') {
          visibleSnippets.push(child);
        }
      });
    }
    let favoritesArr = [];
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value;
      if (typeof snippetVal === 'object') {
        if (snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          favoritesArr.push(snippetVal);
        }
      }
    });
    return {
      selectedPublicSnippet,
      visibleSnippets,
      visibleFolders,
      selectedFolderObj,
      selectedFolder,
      selectedSnippet,
      snippetMap,
      favoritesArr
    };
  }
}

export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require(`.${url}.html`),
    access: { restricted: true }
  };
};
