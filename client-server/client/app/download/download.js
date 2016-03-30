import * as Actions from '../redux/actions.js';

export const createDownloadCtrl = (url) => {
	return {
		url: url,
		controllerAs: 'downloadCtrl',
		controller: DownloadCtrl,
		template: require(`.${url}.html`),
		scope: {},
		access: {restricted: true}
	};
}

class DownloadCtrl {
	constructor($ngRedux, $http) {
		this.$http = $http;
		this.activeUser = {};
		$ngRedux.connect(this.mapStateToThis, this.mapDispatchToThis)(this);
	}
	mapDispatchToThis(dispatch) {
		return {
			generateNewSecret() {
				this.$http.get('/user/api/sublime-secret')
				.then(res => {
					let sublimeSecret = res.data
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
		}
	}
}