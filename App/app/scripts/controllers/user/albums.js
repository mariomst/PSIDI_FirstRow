'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserAlbumsCtrl
 * @description
 * # UserAlbumsCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user', {templateUrl: 'views/user/albums.html', controller: 'UserAlbumsCtrl' })
      .when('/user/:id/album', {redirectTo: '/user'})
  })
  .controller('UserAlbumsCtrl', function ($scope, $controller, $location, $http, Iphotoshare) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    angular.extend($scope.f, {
      get: function() {
        $scope.spinner = true;
        $http.get(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/albums')
          .success(function(data){
            $scope.spinner = false;
            $scope.albums = data;
          })
          .error(function(error){
            $scope.f.handle_get_error();
          });
      }
    });

    $scope.f.get();

  });
