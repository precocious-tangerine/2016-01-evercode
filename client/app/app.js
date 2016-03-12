
import angular from 'angular';
import ngRedux from 'ng-redux';
import createLogger from 'redux-logger';
import {finalReducer} from './redux/reducers.js';
import angular_ui_router from 'angular-ui-router';
import angular_ui_codemirror from 'angular-ui-codemirror';
import {createAuthCtrl} from './auth/auth.js';
import {Folders, Auth} from './services/services.js'
import {snippets} from './snippets/snippets.js';


angular.module('evercode', [angular_ui_router, ngRedux])
  .config(($stateProvider, $urlRouterProvider, $httpProvider, $ngReduxProvider) => {
    $urlRouterProvider.otherwise('/signin');
    $stateProvider
      .state('login', createAuthCtrl('/signin'))
      .state('snippets', snippets('/snippets'))

    $ngReduxProvider.createStoreWith(finalReducer, [createLogger()]);
  })
  .service('Auth', Auth)
  .service('Folders', Folders);
