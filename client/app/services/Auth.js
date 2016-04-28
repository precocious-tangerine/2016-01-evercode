import * as Actions from '../redux/actions.js';

export default class Auth {
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
          .then(() => {
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
          .then(() => {
            Materialize.toast('Success! Check your e-mail for verification', 4000, 'rounded');
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
            if(res.data.selectedSnippet) {
              dispatch(Actions.setSelectedSnippet(res.data.selectedSnippet));
            }
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
        }).then(() => {
          Materialize.toast('Password was succesfully changed!', 4000, 'rounded');
        }).catch(err => {
          console.error(err);
        });
      },

      signout() {
        this.$auth.logout();
        dispatch(Actions.removeActiveUser());
        dispatch(Actions.removeSelectedFolder());
        dispatch(Actions.removeSelectedSnippet());
        dispatch(Actions.clearSnippetMap());
      }
    };
  }
}