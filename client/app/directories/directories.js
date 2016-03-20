import * as FT from '../services/fileTree.js';

export const directories = () => {
  return {
    url: '/main',
    restrict: 'E',
    controllerAs: 'directories',
    controller: DirectoriesCtrl,
    template: require('./main.html'),
    scope: {},
    access: { restricted: true }
  }
}

class DirectoriesCtrl {
  constructor($ngRedux, Folders) {
    $ngRedux.connect(this.mapStateToThis)(this);
    Folders.getFileTree();
    this.Folders = Folders;
    this.folder = {};
    this.snippetArr = [];
    this.sideNavOpen = false;
    this.snippetModalOpen = false;
  }

  toggleSideNav() {
    if (this.sideNavOpen){
      $('#slide-out').animate({left:'-105%'},200, function(){
        $('#slide-out').sideNav('hide');
      })
      this.sideNavOpen = false;
    } else {
      $('#slide-out').animate({left:'66'},200, function(){
        $('#slide-out').sideNav('show');
        $('#sidenav-overlay').click(function(){
          $('#slide-out').animate({left:'-105%'},200)
          this.sideNavOpen = false;
        })
      })
      this.sideNavOpen = true;
    } 
  }

  toggleModal() {

    if (this.snippetModalOpen){
      console.log("modal closal")
      $('#snippets-modal').closeModal();
      this.snippetModalOpen = false;
    } else {
      console.log("modal lodal")
      $('.modal-trigger').leanModal();
      $('#snippets-modal').openModal();
      this.snippetModalOpen = true;
    } 
  }

  addFolder() {
    let path = this.snippetMap.__root.value + '/' + this.folder.name;
    this.Folders.addFolder({ path: path });
    this.folder.name = '';
  }

  changeActiveTab(folderPath) {
    this.Folders.selectFolder(folderPath);
    this.toggleSideNav();
    this.toggleModal();
  }

  removeFolder(folderPath) {
    this.Folders.removeFolder(folderPath);
  }

  mapStateToThis(state) {
    let { snippetMap, selectedFolder } = state;
    let folders = !snippetMap.__root ? null : snippetMap.__root.children.filter(folder => !folder.endsWith('.config')).map(el => (snippetMap[el]));
    let snippetArr =  [];
    Object.keys(snippetMap).forEach(key => {
      let snippetVal = snippetMap[key].value
      if(typeof snippetVal === 'object') {
        if(snippetVal.name !== '.config' && snippetVal.name !== '/.config') {
          snippetArr.push(snippetVal);
        }
      }
    });

    let convertPath = (path) => {
      let result = [];
      while(snippetMap[path]) {
        let urlPath = snippetMap[path].parent ? '.snippets' : 'main';
        result.unshift([snippetMap[path].value, snippetMap[path].filePath, urlPath]);
        path = snippetMap[path].parent;
      }
      return result
    }
    let breadcrumbPath = convertPath(selectedFolder);

    return {
      folders,
      snippetMap,
      snippetArr,
      selectedFolder,
      breadcrumbPath
    };
  }

};
