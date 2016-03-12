angular.module('evercode.tags', [])
.directive('tags', function(){
    return{
        scope:{
            tags: '=data' 
        },
        template: '<span>TAGS: </span><span style="margin-left: 10px" ng-repeat="tag in tags">{{ tag }}</span>'
        }
    }
);