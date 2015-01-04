'use strict';

angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', { templateUrl: 'views/login.html', controller: 'LoginCtrl' })
  })
  .controller('LoginCtrl', function ($scope, $http, $location, $cookieStore, Iphotoshare) {

    $scope.f = {
      //login: function () {
      //  $http.post(Iphotoshare.getUrl_Prefix() + '/api-token-auth/', $scope.user_data)
      //    .success($scope.f.login_success)
      //    .error($scope.f.login_error);
      //},

      login: function() {
        //$cookieStore.put('djangotoken', response.token);
        //$http.defaults.headers.common['Authorization'] = 'Token ' + response.token;
        $scope.spinner = true;
        $http.post(Iphotoshare.getUrl_Prefix() + '/login', $scope.user_data)
          .success(function(data, status){
            $scope.spinner = false;
            //$cookieStore.put('iphoto-user', data);
            Iphotoshare.setUser(data);
            try{
              $location.path('/user');
            }   catch(error) {
              $location.path('/signup');
            }

          })
          .error(function(error, status){
            console.log('error getting things ->', error);
            $scope.spinner = false;
          });
      },

      //login_error: function(r){
      //  var notifications = { 'error': r.non_field_errors[0]};
      //  $cookieStore.put('labprot-notifications', notifications);
      //  $location.path('/login');
      //  $scope.user_data = {};
      //},

      register: function() {
        $location.path('/signup');
      }
    };

  });
