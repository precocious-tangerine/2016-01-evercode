import * as Actions from '../redux/actions.js';

export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require('./snippets.html'),
    scope: {},
    access: { restricted: true }
  };
}

class SnippetsCtrl {
  constructor($ngRedux, Snippets) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.folderName = this.selectedFolder.value;
    
    this.visibleChildren = [];
    this.filePath;
    this.selectedFolder.children.forEach( (child) => {
      if(typeof child.value === 'string' || child.value.name !== '.config') {
        visibleChildren.push(Object.assign({},child));
      } else {
        var configPath = child.value.name;
        this.filePath = configPath.substring(0, configPath - 7);
      }
    });
    // this.data = {};
    // this.data.snippets = [{ name: 'Redux' }, { name: 'Express' }, { name: 'Login' }, { name: 'Auth' }, { name: 'Navbar' }];
    // this.Snippets = Snippets;
  }
  copySnippet(snippet) {
    this.Snippets.getSnippet({ snippetId: snippet._id });
  }

  favoriteSnippet(snippet) {
    this.Snippets.updateSnippet({ snippetId: snippet._id, value: {favorite: true} });
  }
  mapStateToThis(state) {
    return {
      selectedFolder: state.selectedFolder
    };
  }
  mapDispatchToThis(dispatch) {
    return {
      changeFolder(folderNode) {
        dispatch(Actions.setSselectedFolder(folderNode));
      },
      changeSnippet(snippetObj) {
        dispatch(Actions.setSelectedSnippet(snippetObj));
      }
    };
  }
}
