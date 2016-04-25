import * as Actions from '../redux/actions.js';

export default class Public {
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
            this.setSelectedPublicSnippet('share');
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
    };
  }
  mapStateToThis(state) {
    return {
      publicList: state.publicList,
      selectedPublicSnippet: state.selectedPublicSnippet
    };
  }
}

