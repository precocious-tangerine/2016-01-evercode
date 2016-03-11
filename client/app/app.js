angular.module('evercode', ['evercode.directories', 'evercode.services'])
.config(function ($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/login');

//   $stateProvider
//     .state('login', {
//       url: '/login',
//       templateUrl: 'app/auth/signin.html',
//       controller: ''
//     })
//     .state('login', {
//       url: '/login',
//       templateUrl: 'app/auth/signin.html',
//       controller: ''
//     })
//     .state('login', {
//       url: '/login',
//       templateUrl: 'app/auth/signin.html',
//       controller: ''
//     })
})
.run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function(evt, next, current) {
    $rootScope.location = $location.path();
  });
});