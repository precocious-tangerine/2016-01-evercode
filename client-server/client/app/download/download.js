import * as Actions from '../redux/actions.js';

class DownloadCtrl {
	constructor($ngRedux, $http) {
		this.$http = $http;
		this.activeUser = {};
		$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
	}

	confirmCopyAction() {
	  Materialize.toast('Client secret added to your clipboard!', 3000, 'rounded');
	}
	
	mapDispatchToThis(dispatch) {
		return {
			generateNewSecret() {
				this.$http.get('/user/api/sublime-secret')
				.then(res => {
					let sublimeSecret = res.data;
					let newUser = Object.assign({}, this.activeUser, {sublimeSecret});
					dispatch(Actions.setActiveUser(newUser));
				})
				.catch(console.log);
			}
		};
	}
	mapStateToThis(state) {
		return {
			activeUser: state.activeUser ? state.activeUser: {}
		};
	}
}

export const createDownloadCtrl = (url) => {
	return {
		url: url,
		controllerAs: 'downloadCtrl',
		controller: DownloadCtrl,
		template: require(`.${url}.html`),
		scope: {},
		access: {restricted: true}
	};
};

