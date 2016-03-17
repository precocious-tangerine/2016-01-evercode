import * as Actions from '../redux/actions.js';
import convertToTree from './fileTree.js';


export class Folders {
  constructor($http, $ngRedux) {
    window.Folders = this;
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
  }

  mapDispatchToThis(dispatch) {
    return {
      getFileTree() {
        return this.$http({
          method: 'GET',
          url: '/api/user/snippets'
        }).then(res => {
          var snippetMap = {};
          convertToTree(res.data, (treeNode) => {
            let {value, filePath} = treeNode
            let children = treeNode.children.map((child) => child.filePath);
            let parent = tree.parent ? tree.parent.filePath : null;
            snippetMap[filePath] = {value, filePath, children, parent}; 
          });

          dispatch(Actions.setSnippetMap(snippetMap));

          //dispatch(Actions.setSnippetMap(res.data));

        })
      },

      getTestFileTree() {
        return this.$http({
          method: 'GET',
          url: 'api/test-folder-tree'
        }).then(res => {
          var snippetMap = {};
          convertToTree(res.data, (treeNode) => {
            let {value, filePath} = treeNode
            let children = treeNode.children.map((child) => child.filePath);
            let parent = treeNode.parent ? treeNode.parent.filePath : null;
            snippetMap[filePath] = {value, filePath, children, parent}; 
          });

          dispatch(Actions.setSnippetMap(snippetMap));


          // dispatch(Actions.setSnippetMap(res.data));
          // dispatch(Actions.setFileTree(convertToTree(res.data)));
        })
      },
      testSelectedFolder() {
        dispatch(Actions.setSselectedFolder('/testuser/folder1'));
      },

      addFolder(folder) {
        // return this.$http({
        //   method: 'POST',
        //   url: '/api/folders',
        //   data: folder
        // }).then(snippetConfig => {
          let filePath = snippetConfig.filePath;
          let filePaths = filePath.split("/");

          let folderName = filePaths(filePaths.length - 2);
          let parentFolderPath = filePaths.slice(0, filePaths.length - 3).join('/');
          let folderPath = filePaths.slice(0, filePaths.length - 1).join('/');
          Actions.addSnippetMap(folderPath, {value: folderName, parent: parentFolderPath, children: [], filePath: folderPath});


          let snippetConfigName = filePaths(filePaths.length - 1);
          let parentFolder = folderPath;
          Actions.addSnippetMap(filePath, {value: snippetConfig, parent: folderPath, children: [], filePath: filePath});

        // })
      },

      selectFolder(folderPath) {
        dispatch(Actions.setSselectedFolder(folderPath));
      },

      removeFolder(folderPath) {
        // return this.$http({
        //   method: 'DELETE',
        //   url: '/api/folders',
        //   data: folderPath
        // }).then(res => {
          dispatch(Actions.removeSnippetMap(folderPath));
        // })
      }
    }
  }
  mapStateToThis(state) {
    return {
      snippetMap: state.snippetMap,
      selectedFolder: state.selectedFolder,
      selectedSnippet: state.selectedSnippet,
    };
  }
}

export class Snippets {
  constructor($http, $ngRedux) {
    this.$http = $http;
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    window.Snippets = this;
  }

  mapDispatchToThis(dispatch) {
    return {

      getSnippet(snippetId) {
        return this.$http({
          method: 'GET',
          url: '/api/snippets?snippetId=' + snippetId
        });
      },

      addSnippet(snippetObj) {
        // let {filePath} = snippetObj
        // return this.$http({
        //   method: 'POST',
        //   url: '/api/snippets',
        //   data: snippetObj
        // }).then( () => {
          dispatch(Action.addSnippetMap(filePath, snippetObj));
        // });
      },

      updateSnippet(snippetObj) {
        let snippetId = snippetObj;
        // return this.$http({
        //   method: 'PUT',
        //   url: '/api/snippets',
        //   data: { snippetId, value }
        // }).then( () => {
          dispatch(Action.addSnippetMap(filePath, snippetObj));
        // });
      },

      removeSnippet(snippetFilePath) {
        let snippetId = this.snippetMap[snippetFilePath].value.snippetId;
        // return this.$http({
        //   method: 'DELETE',
        //   url: '/api/snippets',
        //   data: { snippetId }
        // }).then(() => {
          dispatch(Actions.removeSnippetMap(snippetFilePath));
        // });
      },

      changeSnippet(snippetFilePath) {
        dispatch(Actions.setSelectedSnippet(this.snippetMap(snippetFilePath)));
      }
    }
  }
  mapStateToThis(state) {
    return {
      snippetMap: state.snippetMap,
      selectedFolder: state.selectedFolder,
      selectedSnippet: state.selectedSnippet,
    };
  }

}

export class Auth {
  constructor($http, $location, $window, Folders, $ngRedux) {
    $ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
    this.$http = $http;
    this.$location = $location;
    this.$window = $window;
  }
  mapDispatchToThis(dispatch) {
    return {
      signin(user) {
        return this.$http({
            method: 'POST',
            url: '/signin',
            data: user
          }).then(token => {
            console.log(token);
            this.$window.localStorage.setItem('com.evercode', token.data);
            this.$location.path('/main');
          })
          .catch(error => {
            this.failed = false;
            console.error(error);
          });
      },

      signup(user) {
        return this.$http({
            method: 'POST',
            url: '/signup',
            data: user
          }).then(token => {
            console.log(token);
            this.$window.localStorage.setItem('com.evercode', token.data);
            this.$location.path('/main');
          })
          .catch(error => {
            this.failed = false;
            console.error(error);
          });
      },

      isAuth() {
        return !!this.$window.localStorage.getItem('com.evercode');
      },

      signout() {
        return this.$http({
          method: 'GET',
          url: '/signout'
        }).then(function() {
          this.$window.localStorage.removeItem('com.evercode');
          this.$location.path('/signin');
        })
      }
    }
  }

}
