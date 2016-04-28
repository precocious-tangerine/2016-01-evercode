class MoveSnippetModalCtrl {
  constructor(Snippets) {
    this.Snippets = Snippets;
  }

  moveSnippet(newPath){
    let oldPath = this.selectedsnippet.value.filePath;
    let snippetToMove = Object.assign({},
      this.selectedsnippet.value, {
        filePath: newPath + '/' + this.selectedsnippet.value.name
      });
    this.Snippets.updateSnippet(snippetToMove, oldPath);
    this.hideModal();
  }

  hideModal() {
    this.show = false;
  }

}

let createMoveModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      selectedsnippet: '=',
      name: '=',
      paths: '='
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

export default createMoveModal;