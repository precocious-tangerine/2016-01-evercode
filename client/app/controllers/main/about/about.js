class AboutCtrl {
  constructor() {
  }
}

const aboutPage = () => {
  return {
    url: '/about',
    controllerAs: 'aboutCtrl',
    controller: AboutCtrl,
    template: require('./about.html'),
    scope: {},
    access: {restricted: false}
  };
};

export default aboutPage;

