angular.module('evercode', [])
.config(function ($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/signin.html',
      controller: ''
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/signin.html',
      controller: ''
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/signin.html',
      controller: ''
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/signin.html',
      controller: ''
    })
})