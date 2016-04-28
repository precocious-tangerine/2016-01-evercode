import * as Actions from '../redux/actions.js';

export default class Snippets {
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
            if(this.activeUser.selectedSnippet === oldFilePath) {
              this.Auth.updateUser({ selectedSnippet: res.data.filePath });
            }
            if(this.selectedPublicSnippet === oldFilePath) {
              dispatch(Actions.setSelectedPublicSnippet(res.data.filePath));
            }
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
          }).then(() => {
            this.deselectSnippet();
            dispatch(Actions.removeSnippetMap(snippetObj.filePath));
            if(this.activeUser.selectedSnippet === snippetObj.filePath) {
              this.Auth.updateUser({ selectedSnippet: null });
            }
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
          }).then(() => {
            this.Auth.updateUser({ username: userObj.username });
            this.Folders.getFileTree();
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
      activeUser: state.activeUser,
      selectedPublicSnippet: state.selectedPublicSnippet
    };
  }

}
