angular.module('evercode', ['evercode.directories', 'evercode.services', 'evercode.auth', 'evercode.snippets', 'ui.router', 'evercode.editor', 'ui.codemirror'])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
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
      .state('snippets', {
        url: '/snippets',
        templateUrl: 'app/snippets/snippets.html',
        controller: 'SnippetsCtrl',
        access: {restricted: true}
      })
      .state('editor', {
         url: '/editor',
         templateUrl: 'app/editor/editor.html',
         controller: 'EditorCtrl',
         access: {restricted: false}
       })

    $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function($window) {
    var attach = {
      request: function(object) {
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
  .run(function($rootScope, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      $rootScope.location = $location.path();
      if (next.access.restricted && !Auth.isAuth()) {
        $location.path('/signin');
      }
    });
  });
