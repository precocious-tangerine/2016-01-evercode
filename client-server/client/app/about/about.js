class AboutCtrl {
  constructor() {
  }
}

export const createAboutCtrl = (url) => {
  return {
    url: url,
    controllerAs: 'aboutCtrl',
    controller: AboutCtrl,
    template: require(`.${url}.html`),
    scope: {},
    access: {restricted: false}
  };
};

