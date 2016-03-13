export const directories = () => {
return {
    url: '/main',
    restrict: 'E',
    controllerAs: 'directories',
    controller: DirectoriesCtrl,
    template: require('./main.html'),
    scope: {},
    access: {restricted: false}
  }
}

class DirectoriesCtrl {
  constructor($location) {
  // const unsubscribe = $ngRedux.connect(this.mapStateToThis, AsyncActions)((selectedState, actions) => {
  //   this.componentWillReceiveStateAndActions(selectedState, actions);
  //   Object.assign(this, selectedState, actions);
  // });
  this.data = {};
  this.data.folders = [{name: 'React'}];
  this.folder = {};
  }
  initialize() {
    Folders.getFolders().then(data => {
      this.data.folders = data;
    });
  };

  addFolder() {
    Folders.addFolder({ name: this.folder.name })
      .then(res => {
        this.initialize();
      });
    this.folder.name = '';
    
  };

  changeTab(tabName){
    // $rootScope.activeTab = tabName;
  };
  
  // Which part of the Redux global state does our component want to receive?
  // mapStateToThis(state) {
  //   const { selectedReddit, postsByReddit } = state;
  //   const {
  //     isFetching,
  //     lastUpdated,
  //     items: posts
  //   } = postsByReddit[selectedReddit] || {
  //     isFetching: true,
  //     items: []
  //   };

  //   return {
  //     selectedReddit,
  //     posts,
  //     isFetching,
  //     lastUpdated
  //   };
  // }

  };