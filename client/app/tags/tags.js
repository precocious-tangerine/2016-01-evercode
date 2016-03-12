angular.module('evercode.tags', [])
.directive('tags', function(){
    return{
        scope:{
            tags: '=data' 
        },
        template: '<li ng-repeat="tag in tags">{{ tag }} </li>'
        }
    }
);