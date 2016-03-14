import angular from 'angular';
import ngRedux from 'ng-redux';
import createLogger from 'redux-logger';
import { finalReducer } from './redux/reducers.js';
import angular_ui_router from 'angular-ui-router';
import ui_codemirror from 'angular-ui-codemirror';
import { createAuthCtrl } from './auth/auth.js';
import { Folders, Auth, Snippets } from './services/services.js'
import { snippets } from './snippets/snippets.js';
import { directories } from './directories/directories.js';
import { editor } from './editor/editor.js';

angular.module('evercode', [ngRedux, angular_ui_router])
  .config(($stateProvider, $urlRouterProvider, $httpProvider, $ngReduxProvider) => {
    $urlRouterProvider.otherwise('/main');
    $stateProvider
      .state('main', directories())
      .state('main.snippets', snippets('/snippets'))
      .state('main.snippets.editor', editor())
      .state('login', createAuthCtrl('/signin'))
      .state('signup', createAuthCtrl('/signup'))
      .state('signout', {
        resolve: {
          signout: function(Auth) {
            return Auth.signout();
          }
        }
      })

    $httpProvider.interceptors.push('AttachTokens');

    $ngReduxProvider.createStoreWith(finalReducer, [createLogger()]);
  })
  .service('Auth', Auth)
  .service('Folders', Folders)
  .service('Snippets', Snippets)
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
