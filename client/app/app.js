
import angular from 'angular';
import ngRedux from 'ng-redux';
import createLogger from 'redux-logger';
import finalReducer from './redux/reducers.js';
import angular_ui_router from 'angular-ui-router';
import angular_ui_codemirror from 'angular-ui-codemirror';


angular.module('evercode', ['evercode.directories', 'evercode.services', 'evercode.auth', 'evercode.snippets', 'evercode.editor', angular_ui_router, angular_ui_codemirror, ngRedux])
  .config(($stateProvider, $urlRouterProvider, $httpProvider, $ngReduxProvider) => {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/signin',
        templateUrl: './app/auth/signin.html',
        controller: 'AuthCtrl',
        access: {restricted: false}
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthCtrl',
        access: {restricted: false}
      })
      .state('signout', {
        resolve: {
          signout: function(Auth) {
            return Auth.signout();   
          }
        },
        access: {restricted: false}
      })
      .state('main', {
        url: '/main',
        templateUrl: './app/directories/main.html',
        controller: 'DirectoriesCtrl',
        access: {restricted: true}
      })
      .state('main.snippets', {
        url: '/:folder',
        templateUrl: 'app/snippets/snippets.html',
        controller: 'SnippetsCtrl',
        access: {restricted: true}
      })
      .state('main.snippets.editor', {
         url: '/editor',
         templateUrl: 'app/editor/editor.html',
         controller: 'EditorCtrl',
         access: {restricted: true}
       })

    $httpProvider.interceptors.push('AttachTokens');

    $ngReduxProvider.createStoreWith(finalReducer, [createLogger()]);
  })
  .factory('AttachTokens', ($window) => {
    var attach = {
      request: (object) => {
        var jwt = $window.localStorage.getItem('com.evercode');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(($rootScope, $location, Auth) => {
    $rootScope.$on('$stateChangeStart', (evt, next, current) => {
      $rootScope.location = $location.path();
      if (next.access.restricted && !Auth.isAuth()) {
        $location.path('/signin');
      }
    });
  });
