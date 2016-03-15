import * as Actions from '../redux/actions.js';
import R from 'ramda';

export const snippets = (url) => {
  return {
    url: url,
    controllerAs: 'snippets',
    controller: SnippetsCtrl,
    template: require('./snippets.html'),
    scope: {
      content: '='
    },
    access: { restricted: true }
  };
}

class SnippetsCtrl {
  constructor($ngRedux, Snippets) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    if(R.empty(this.selectedFolder)) {
      console.log('this is being triggered');
      this.folderName = this.selectedFolder.value;
      this.visibleChildren = [];
      this.filePath;
      this.selectedFolder.children.forEach( (child) => {
        if(typeof child.value === 'string' || child.value.name !== '.config') {
          const childLocal = child;
          visibleChildren.push(childLocal);
        } else {
          var configPath = child.value.name;
          this.filePath = configPath.substring(0, configPath - 7);
        }
      });
    } else {
      this.folderName = 'No selected folder';
      this.filePath = '';
      this.visibleChildren = [];
    }
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
