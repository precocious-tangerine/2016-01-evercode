import * as Actions from '../redux/actions.js';
import { convertToTree, getAllChildren, createBoundMethods } from './fileTree.js';

export class Folders {
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
          }).then(res => {
            var snippetMap = convertToTree(res.data);
            dispatch(Actions.setSnippetMap(snippetMap));
            this.selectedFolder ? null : dispatch(Actions.setSelectedFolder('/' + this.email));
            snippetPath ? dispatch(Actions.setSelectedSnippet(snippetPath)) : null;
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
          }).then(snippet => {
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
        let oldChildren = boundFT.allChildren(oldNode.filePath, true);
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
              changeAllChildFolders(this.snippetMap[child], newPath, currFilePath)
            })
          }
        }

        changeAllChildFolders(newNode, newNode.filePath);

        newChildren.forEach((currChild, index) => {
          return this.$http ({
            method: 'PUT',
            url: 'files/api/snippets',
            data: {snippetId: currChild.value._id, value: currChild.value}
          })
          .then(res => {
            if(index === newChildren.length-1) {
              this.getFileTree();
            }
          })
        })
      },

      moveSnippet(oldNode, newNode) {
        // dispatch(Actions.removeSnippetMap(oldNode.filePath));
        // dispatch(Actions.addSnippetMap(newNode.filePath, newNode));
      },

      removeFolder(folderPath) {
        return this.$http({
            method: 'DELETE',
            url: 'files/api/folders',
            params: { filePath: folderPath }
          }).then(response => {
            dispatch(Actions.removeSnippetMap(folderPath))
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
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

export class Snippets {
  constructor($http, $ngRedux, Folders, Auth) {
    this.$http = $http;
    this.Folders = Folders;
    this.Auth = Auth;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {
      getSnippet(snippetId) {
        return this.$http({
          method: 'GET',
          url: 'files/api/snippets?_id=' + snippetId
        });
      },

      addSnippet(snippetObj) {
        let { filePath } = snippetObj
        return this.$http({
            method: 'POST',
            url: 'files/api/snippets',
            data: snippetObj
          }).then((res) => {
            dispatch(Actions.addSnippetMap(res.data.filePath, res.data));
            dispatch(Actions.removeSelectedPublicSnippet());
            this.changeSelectedSnippet(res.data.filePath);
            Materialize.toast('Snippet added!', 3000, 'rounded');
          })
          .catch(error => {
            console.error(error);
          });
      },

      updateSnippet(snippetObj, oldFilePath) {
        //delete old id so mongoose doesn't get upset
        let snippetId = snippetObj._id;
        delete snippetObj.Id;
        return this.$http({
            method: 'PUT',
            url: 'files/api/snippets',
            data: { snippetId, value: snippetObj }
          }).then(res => {
            let nodeToPass = Object.assign({}, this.snippetMap[oldFilePath], { filePath: res.data.filePath, value: res.data });
            Materialize.toast('Snippet updated!', 3000, 'rounded');
            dispatch(Actions.updateSnippetMap(oldFilePath, res.data.filePath, nodeToPass));
            this.activeUser.selectedSnippet === oldFilePath ? this.Auth.updateUser({ selectedSnippet: res.data.filePath }) : null;
            this.selectedPublicSnippet === oldFilePath ? dispatch(Actions.setSelectedPublicSnippet(res.data.filePath)) : null;
            dispatch(Actions.setSelectedSnippet(res.data.filePath));
          })
          .catch(error => {
            console.error(error);
          });

      },

      removeSnippet(snippetObj) {
        return this.$http({
            method: 'DELETE',
            url: 'files/api/snippets',
            params: { snippetId: snippetObj.value._id }
          }).then((response) => {
            this.deselectSnippet();
            dispatch(Actions.removeSnippetMap(snippetObj.filePath));
            this.activeUser.selectedSnippet === snippetObj.filePath ? this.Auth.updateUser({ selectedSnippet: null }) : null;
            Materialize.toast('Successfully removed!', 3000, 'rounded');
          })
          .catch(error => {
            console.error(error);
          });
      },

      changeSelectedSnippet(snippetFilePath) {
        dispatch(Actions.removeSelectedPublicSnippet());
        dispatch(Actions.setSelectedSnippet(snippetFilePath));
        this.Auth.updateUser({ selectedSnippet: snippetFilePath });
      },

      deselectSnippet() {
        dispatch(Actions.removeSelectedSnippet());
      },

      updateUsername(userObj) {
        return this.$http({
            method: 'PUT',
            url: 'files/api/user/snippets',
            data: userObj
          }).then(res => {
            this.Auth.updateUser({ username: userObj.username });
            this.Folders.getFileTree();
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
  mapStateToThis(state) {
    return {
      snippetMap: state.snippetMap,
      selectedFolder: state.selectedFolder,
      selectedSnippet: state.selectedSnippet,
      activeUser: state.activeUser,
      selectedPublicSnippet: state.selectedPublicSnippet
    };
  }

}

export class Public {
  constructor($http, $ngRedux) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.$http = $http;
  }
  mapDispatchToThis(dispatch) {
    return {
      getPublicSnippets() {
        return this.$http({
            method: 'GET',
            url: 'files/public/snippets'
          }).then(res => {
            dispatch(Actions.setPublicList(res.data));
          })
          .catch(error => {
            console.error(error);
          });
      },

      getSharedSnippet(id) {
        this.$http({
            method: 'GET',
            url: '/files/share?s=' + id,
          })
          .then((response) => {
            this.setPublicList(response.data);
            this.setSelectedPublicSnippet("share");
          });
      },

      setPublicList(data) {
        dispatch(Actions.setPublicList(data));
      },

      setSelectedPublicSnippet(filePath) {
        dispatch(Actions.removeSelectedSnippet());
        dispatch(Actions.setSelectedPublicSnippet(filePath));
      },

      removeSelectedPublicSnippet() {
        dispatch(Actions.removeSelectedPublicSnippet());
      }
    }
  }
  mapStateToThis(state) {
    return {
      publicList: state.publicList,
      selectedPublicSnippet: state.selectedPublicSnippet
    }
  }
}

export class Auth {
  constructor($http, $auth, $ngRedux, Folders) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.$http = $http;
    this.Folders = Folders;
    this.$auth = $auth;
  }
  mapDispatchToThis(dispatch) {
    return {
      signin(user) {
        return this.$http({
            method: 'POST',
            url: 'user/signin',
            data: user
          }).then((res) => {
            this.$auth.setToken(res.data.token);
            this.getUserInfo();
            $('#snippets-modal').closeModal({
              dismissible: true,
              complete: () => {
                $('.lean-overlay').remove();
              }
            });
            Materialize.toast('Successfully signed in!', 5000, 'rounded');
          })
          .catch(error => {
            console.error(error);
          });
      },

      githubSignin() {
        this.$auth.authenticate('github')
          .then((res) => {
            this.getUserInfo();
            Materialize.toast('Successfully signed in!', 5000, 'rounded');
          })
          .catch(error => {
            console.error(error);
          });
      },

      signup(user) {
        return this.$http({
            method: 'POST',
            url: 'user/signup',
            data: user
          })
          .then(res => {
            Materialize.toast('Success! Check your e-mail for verification', 4000, 'rounded')
          })
          .catch(error => {
            this.failed = false;
            console.error(error);
          });
      },

      getUserInfo() {
        return this.$http({
            method: 'GET',
            url: '/user/api/userInfo'
          }).then(res => {
            dispatch(Actions.setActiveUser(res.data));
            this.Folders.getFileTree();
            res.data.selectedSnippet ? dispatch(Actions.setSelectedSnippet(res.data.selectedSnippet)) : null;
          })
          .catch(error => {
            console.error(error);
          });
      },

      updateUser(userObj) {
        return this.$http({
            method: 'PUT',
            url: 'user/api/userInfo',
            data: userObj
          }).then(res => {
            dispatch(Actions.setActiveUser(res.data));
          })
          .catch(error => {
            console.error(error);
          });
      },

      updatePassword(infoObj){
        return this.$http({
          method: 'PUT',
          url: 'user/api/updatePassword',
          data: infoObj
        }).then(res => {
          Materialize.toast('Password was succesfully changed!', 4000, 'rounded');
        }).catch(err => {
          console.error(err);
        })
      },

      signout() {
        this.$auth.logout();
        dispatch(Actions.removeActiveUser());
        dispatch(Actions.removeSelectedFolder());
        dispatch(Actions.removeSelectedSnippet());
        dispatch(Actions.clearSnippetMap());
      }
    }
  }
}
