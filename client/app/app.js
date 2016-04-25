import angular from 'angular';
import ngRedux from 'ng-redux';
import createLogger from 'redux-logger';
import {finalReducer} from './redux/reducers.js';
import angular_ui_router from 'angular-ui-router';
import 'angular-ui-codemirror';
import {createAboutCtrl} from './main/about/about.js';
import {createDownloadCtrl} from './main/download/download.js';
import {search} from './main/editor/search/search.js';
import {Folders, Auth, Snippets, Public} from './services/index.js';
import {createFolderModal, createEditorModal, createMoveModal, createAuthModal} from './modals/index.js';
import {snippets} from './main/editor/snippets/snippets.js';
import {createMainCtrl} from './main/main.js';
import {editor} from './main/editor/editor.js';
import {publicPage} from './main/public/public.js';
import {profile} from './main/editor/profile/profile.js';
import satellizer from 'satellizer';
import setup from '../../setup.js';
import 'ngclipboard';
import 'angular-animate';
import './tinymce/tinymce.js';
import 'ng-focus-on';

window.createFolderModal = createFolderModal;
window.createEditorModal = createEditorModal;
window.createMoveModal = createMoveModal;
window.createAuthModal = createAuthModal;


angular.module('evercode', [ngRedux, angular_ui_router, 'ui.codemirror', satellizer, 'ngclipboard', 'ngAnimate', 'ui.tinymce', 'focusOn'])
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
      .state('main.about', createAboutCtrl('/about'));

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
  .directive('move', createMoveModal)
  .factory('AttachTokens', ($window) => {
    var attach = {
      request: (object) => {
        var jwt = $window.localStorage.getItem('satellizer_token');
        if (jwt) {
          object.headers.Authorization = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(($rootScope, $state, $auth, $location) => {
    $rootScope.$on('$stateChangeStart', (event, next, toParams, fromState) => {
      if (($location.absUrl().indexOf('?') === -1) && !$auth.isAuthenticated() && (next.access.restricted || next.name === 'main.editor')) {
        if (!fromState.name) {
          $state.go('main.public');
        }
        event.preventDefault();
        Materialize.toast('Please sign in first', 2000, 'rounded');
      }
    });
    $rootScope.$on('$stateChangeSuccess', () => {
      $('.material-tooltip').css('display', 'none');
      if ($state.is('main')) {
        $state.go('.public');
      }
    });
  });
