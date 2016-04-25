import {EditorCtrl} from '../../main/editor/editor.js';

let createEditorModal = () => {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    link(scope, element, attrs) {
      scope.dialogStyle = {};
      if (scope.editorModal.publicList && attrs.snippetPath) {
        scope.editorModal.snippetObj = scope.editorModal.publicList[attrs.snippetPath] || {};
      }
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
    },
    controllerAs: 'editorModal',
    controller: EditorCtrl,
    bindToController: true,
    template: require(`./editorModal.html`),
    url: '/editor'
  };
};

export default createEditorModal;
