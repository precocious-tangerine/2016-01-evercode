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
	constructor() {
	}
}