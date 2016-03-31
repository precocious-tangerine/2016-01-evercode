import { getAllFoldersPaths } from './../services/fileTree.js';

class MoveSnippetModalCtrl {
  constructor() {
    console.log('rendered');
    this.getAllFoldersPaths = getAllFoldersPaths;
    // this.paths = getAllFoldersPaths(this.root);
    // console.log('paths', this.paths);
  }

  hideModal() {
    this.show = false;
  }

}

export let createMoveModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      selectedsnippet: '=',
      name: '=',
      email: '=',
      snippetmap: '='
    },
    link(scope, element, attrs) {
      scope.dialogStyle = {};
      if(attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if(attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
    },
    controllerAs: 'moveSnippetModalCtrl',
    controller: MoveSnippetModalCtrl,
    bindToController: true,
    template: require(`./moveModal.html`)
  };
};