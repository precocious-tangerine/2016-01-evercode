class FolderModalCtrl {
  constructor(Folders) {
    this.Folders = Folders;
  }

  renameFolder() {
    this.Folders.renameFolder(this.selectedfolder, this.name);
    this.hideModal();
  }

  hideModal() {
    this.show = false;
  }
}

let createFolderModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      selectedfolder: '=',
      name: '='
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
    controllerAs: 'folderModalCtrl',
    controller: FolderModalCtrl,
    bindToController: true,
    template: require(`./foldermodal.html`)
  };
};

export default createFolderModal;