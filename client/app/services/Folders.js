import * as Actions from '../redux/actions.js';
import { convertToTree, createBoundMethods } from '../redux/fileTree.js';

export default class Folders {
  constructor($http, $ngRedux) {
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {
      getFileTree(snippetPath) {
        return this.$http({
            method: 'GET',
            url: 'files/api/user/snippets'
          })
          .then(res => {
            var snippetMap = convertToTree(res.data);
            dispatch(Actions.setSnippetMap(snippetMap));
            if(!this.selectedFolder) {
              dispatch(Actions.setSelectedFolder('/' + this.email));
            }
            if(snippetPath) {
              dispatch(Actions.setSelectedSnippet(snippetPath));
            }
          })
          .catch(error => {
            console.error(error);
          });
      },

      addFolder(folder) {
        return this.$http({
            method: 'POST',
            url: 'files/api/folders',
            data: folder
          })
          .then(snippet => {
            dispatch(Actions.addSnippetMap(snippet.data.filePath, snippet.data));
          })
          .catch(error => {
            console.error(error);
          });
      },

      selectFolder(folderPath) {
        dispatch(Actions.setSelectedFolder(folderPath));
      },
      
      renameFolder(oldNode, newName) {
        let boundFT = createBoundMethods(this.snippetMap);
        let oldParent = boundFT.parent(oldNode.filePath);
        let newNode = Object.assign({}, oldNode, {value: newName, filePath: oldParent.filePath + '/' + newName});

        let newChildren = [];

        let changeAllChildFolders = (node, currFilePath, parentFilePath) => {
          if(!node) {
            return;
          }
          if(typeof node.value === 'object') {
            let newValue = Object.assign({}, node.value, {filePath: currFilePath});
            let newNode = Object.assign({}, node, {parent: parentFilePath, filePath: currFilePath,  value: newValue});
            newChildren.push(newNode);
            return;
          } else {
            node.children.forEach(child => {
              let childPathArr = child.split('/');
              let newPath = currFilePath + '/' + childPathArr[childPathArr.length-1];
              changeAllChildFolders(this.snippetMap[child], newPath, currFilePath);
            });
          }
        };

        changeAllChildFolders(newNode, newNode.filePath);

        newChildren.forEach((currChild, index) => {
          return this.$http ({
            method: 'PUT',
            url: 'files/api/snippets',
            data: {snippetId: currChild.value._id, value: currChild.value}
          })
          .then(() => {
            if(index === newChildren.length-1) {
              this.getFileTree();
            }
          });
        });
      },

      removeFolder(folderPath) {
        return this.$http({
            method: 'DELETE',
            url: 'files/api/folders',
            params: { filePath: folderPath }
          }).then(() => {
            dispatch(Actions.removeSnippetMap(folderPath));
          })
          .catch(error => {
            console.error(error);
          });
      }
    };
  }

  mapStateToThis(state) {
    return {
      snippetMap: state.snippetMap,
      selectedFolder: state.selectedFolder,
      selectedSnippet: state.selectedSnippet,
      email: state.activeUser.email
    };
  }
}
