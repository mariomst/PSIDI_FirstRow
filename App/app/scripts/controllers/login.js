'use strict';

angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', { templateUrl: 'views/login.html', controller: 'LoginCtrl' })
  })
  .controller('LoginCtrl', function ($scope, $http, $location, $cookieStore, Iphotoshare) {

    $scope.errors = [];

    $scope.f = {

      login: function() {
        $scope.spinner = true;
        $http.post(Iphotoshare.getUrl_Prefix() + '/login', $scope.user_data)
          .success(function(data, status){
            $scope.spinner = false;
            Iphotoshare.setUser(data);
            try{
              $location.path('/user');
            }   catch(error) {
              $location.path('/signup');
            }

          })
          .error(function(error, status){
            console.log('error getting things ->', error);
            $scope.show_error = true;
            $scope.errors.push("An error happened when attempting login. Or the user/password combination was incorrect, or you have network problems.");
            $scope.spinner = false;
            $scope.user_data = {};
            $('#username').focus();
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
