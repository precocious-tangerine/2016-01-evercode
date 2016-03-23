import angular from 'angular';
import ngRedux from 'ng-redux';
import createLogger from 'redux-logger';
import { finalReducer } from './redux/reducers.js';
import angular_ui_router from 'angular-ui-router';
import ui_codemirror from 'angular-ui-codemirror';
import { createAuthCtrl } from './auth/auth.js';
import { search } from './search/search.js';
import { Folders, Auth, Snippets } from './services/services.js';
import { snippets } from './snippets/snippets.js';
import { createMainCtrl } from './main/main.js';
import { editor } from './editor/editor.js';
import satellizer from 'satellizer';
import config from './../../server/config.js';
import ngclipboard from 'ngclipboard';
import ngAnimate from 'angular-animate';
import tinymce from './tinymce/tinymce.js';

angular.module('evercode', [ngRedux, angular_ui_router, 'ui.codemirror', satellizer, 'ngclipboard', 'ngAnimate', 'ui.tinymce'])
  .config(($stateProvider, $urlRouterProvider, $httpProvider, $ngReduxProvider, $authProvider) => {

    $authProvider.oauth2({
      name: 'github',
      url: '/auth/github',
      clientId: config.githubClientId,
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://github.com/login/oauth/authorize'
    });

    $urlRouterProvider.otherwise('/main');
    $stateProvider
      .state('main', createMainCtrl())
      .state('main.signin', createAuthCtrl('/signin'))
      .state('main.signup', createAuthCtrl('/signup'))
      .state('main.editor', editor())
      .state('main.snippets', snippets('/snippets', '/snippets'))
      .state('main.snippets.editor', editor())
      .state('main.favorites', snippets('/favorites', '/favorites'))
      .state('main.search', search())
      .state('main.search.editor', editor())

    $httpProvider.interceptors.push('AttachTokens');

    $ngReduxProvider.createStoreWith(finalReducer, [createLogger()]);
  })
  .service('Auth', Auth)
  .service('Folders', Folders)
  .service('Snippets', Snippets)
  .factory('AttachTokens', ($window) => {
    var attach = {
      request: (object) => {
        var jwt = $window.localStorage.getItem('satellizer_token');
        if (jwt) {
          object.headers['Authorization'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(($rootScope, $state, Auth) => {
    $rootScope.$on('$stateChangeStart', (evt, next, current) => {
      if (next.access.restricted && !Auth.isAuth()) {
        $state.go('main.signin');
      }
    });
  });