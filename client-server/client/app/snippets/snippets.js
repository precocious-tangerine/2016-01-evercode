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

export let createFolderModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      other: '='
    },
    link(scope, element, attrs) {
      scope.dialogStyle = {};
      attrs.width ? scope.dialogStyle.width = attrs.width: null;
      attrs.height ? scope.dialogStyle.height = attrs.height: null;
    },
    controllerAs: 'folderModal',
    controller: SnippetsCtrl,
    bindToController: true,
    template: require(`./folderModal.html`),
    url: '/snippets'
  }
}

class SnippetsCtrl {
  constructor($ngRedux, Snippets, Folders, Public, $state) {
    $ngRedux.connect(this.mapStateToThis)(this);
    this.Public = Public;
    this.Folders = Folders;
    this.Snippets = Snippets;
    this.folderInput = false;
    this.folderModalShow = false;
    this.$state = $state;
  }

  toggleFolderModal() {
    console.log('toggleFolderModal: ', this.folderModalShow)
    this.folderModalShow = !this.folderModalShow;
  }

  hideModal() {
    this.show = false;
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
      this.selectedPublicSnippet === snippetPath ? null : this.Public.setSelectedPublicSnippet(snippetPath);
    } else {
      this.selectedSnippet === snippetPath ? null : this.Snippets.changeSelectedSnippet(snippetPath);
    }
  }

  deselectSnippet() {
    this.Public.removeSelectedPublicSnippet();
    this.Snippets.deselectSnippet();
  }

  removeSnippet(snippetObj) {
    this.Snippets.removeSnippet(snippetObj);
  }

  closeSideNav() {
    this.$state.go('main.editor');
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
      let snippetVal = snippetMap[key].value
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
