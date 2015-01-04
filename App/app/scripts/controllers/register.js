'use strict';

angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signup', { templateUrl: 'views/register.html', controller: 'RegisterCtrl' })
  })
  .controller('RegisterCtrl', function ($scope, $http, $location, Iphotoshare) {

    $scope.user_data = {};

    console.log('RegisterCtrl');

    console.log(Iphotoshare.getUrl_Prefix());

    $scope.f = {
      submit: function(){
        if($scope.user_data.password != $scope.user_data.confirm_password){

        } else {
          $scope.spinner = true;
          $http.post(Iphotoshare.getUrl_Prefix() + '/signup', $scope.user_data)
            .success(function(data){
              console.log("user created", data);
              $location.path('/login');
              $scope.spinner = false;
            })
            .error(function(error){
              console.log("error creating user", error);
              $scope.spinner = false;
            });
        }
      }
    }
  });
