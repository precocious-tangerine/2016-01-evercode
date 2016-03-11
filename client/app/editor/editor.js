angular.module('evercode.editor', [])
.controller('EditorCtrl', [ '$scope', function($scope) {
    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        readOnly: 'nocursor',
        mode: 'xml',
        value: 'hello'
    };
}]);