export const createAboutCtrl = (url) => {
  return {
    url: url,
    controllerAs: 'aboutCtrl',
    controller: AboutCtrl,
    template: require(`.${url}.html`),
    scope: {},
    access: {restricted: true}
  };
}

class AboutCtrl {
  constructor() {
  }
}