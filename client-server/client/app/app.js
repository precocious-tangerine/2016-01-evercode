import angular from 'angular';
import ngRedux from 'ng-redux';
import createLogger from 'redux-logger';
import { finalReducer } from './redux/reducers.js';
import angular_ui_router from 'angular-ui-router';
import ui_codemirror from 'angular-ui-codemirror';
import { createAuthModal } from './auth/auth.js';
import { createAboutCtrl } from './about/about.js';
import { createDownloadCtrl } from './download/download.js';
import { search } from './search/search.js';
import { Folders, Auth, Snippets, Public } from './services/services.js';
import { snippets, createFolderModal } from './snippets/snippets.js';
import { createMainCtrl } from './main/main.js';
import { editor, createEditorModal } from './editor/editor.js';
import { publicPage } from './public/public.js';
import { profile } from './profile/profile.js';
import satellizer from 'satellizer';
import setup from '../../../setup.js';
import ngclipboard from 'ngclipboard';
import ngAnimate from 'angular-animate';
import tinymce from './tinymce/tinymce.js';
angular.module('evercode', [ngRedux, angular_ui_router, 'ui.codemirror', satellizer, 'ngclipboard', 'ngAnimate', 'ui.tinymce'])
  .config(($stateProvider, $urlRouterProvider, $httpProvider, $ngReduxProvider, $authProvider) => {

    $authProvider.oauth2({
      name: 'github',
      url: '/user/auth/github',
      clientId: setup.githubClientId,
      redirectUri: window.location.origin,
      authorizationEndpoint: 'https://github.com/login/oauth/authorize'
    });

    $urlRouterProvider.otherwise('/main/public');
    $stateProvider
      .state('main', createMainCtrl())
      .state('main.public', publicPage('/public'))
      .state('main.editor', editor())
      .state('main.editor.snippets', snippets('/snippets'))
      .state('main.editor.favorites', snippets('/favorites'))
      .state('main.editor.profile', profile())
      .state('main.editor.search', search())
      .state('main.download', createDownloadCtrl('/download'))
      .state('main.about', createAboutCtrl('/about'))

    $httpProvider.interceptors.push('AttachTokens');

    $ngReduxProvider.createStoreWith(finalReducer, [createLogger()]);
  })
  .service('Auth', Auth)
  .service('Folders', Folders)
  .service('Snippets', Snippets)
  .service('Public', Public)
  .directive('signin', createAuthModal('/signin'))
  .directive('signup', createAuthModal('/signup'))
  .directive('editor', createEditorModal)
  .directive('folder', createFolderModal)
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
  .run(($rootScope, $state, $auth, Auth) => {
    $rootScope.$on('$stateChangeStart', (event, next, current) => {
      if (next.access.restricted && !$auth.isAuthenticated()) {
        event.preventDefault();
        Materialize.toast('Please sign in first', 2000, 'rounded');
      }
    });
    $rootScope.$on('$stateChangeSuccess', () => {
      $state.is('main') ? $state.go('.public') : null;
    });
  });
