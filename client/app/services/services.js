export function Folders() {
  this.$inject = ['$http'];
  return ({ 
  getFolders() {
      return $http({
        method: 'GET',
        url: '/folders'
      }).then(function(res) {
        return res.data;
      });
  },

  addFolder(list) {
      return $http({
        method: 'POST',
        url: '/folders',
        data: list
      });
  },

  removeFolder(list) {
      return $http({
        method: 'POST',
        url: '/folders/remove',
        data: list
      });
  }
});
}

export function Auth() {

  this.$inject = ['$http', '$location', '$window'];
  return ({ 
  signin(user) {
      return $http({
        method: 'POST',
        url: '/signin',
        data: user
      })
  },
  signup(user) {
      return $http({
        method: 'POST',
        url: '/signup',
        data: user
      })
  },

  isAuth() {
      return !!$window.localStorage.getItem('com.evercode');
  },

  signout() {
      return $http({
        method: 'GET',
        url: '/signout'
      }).then(function() {
        $window.localStorage.removeItem('com.evercode');
        $location.path('/signin');
      })
  }
  
});
}
