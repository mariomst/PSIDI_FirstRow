'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserAlbumCtrl
 * @description
 * # UserAlbumCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:id/album/create', {templateUrl: 'views/user/album_form.html', controller: 'UserAlbumCtrl' })
  })
  .controller('UserAlbumCtrl', function ($scope, $http, $location, $controller, Iphotoshare, Helpers) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.album = {};

    $scope.f = {

      submit: function(){
        $scope.spinner = true;
        $http.post(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/albums', $scope.album)
          .success(function(data){
            $scope.spinner = false;
            console.log("created", data);
            $location.path('/user/' + $scope.user.userID + '/album/' + data.albumID + '/photo');
            //TODO: redirect to users/x/albums/ "data.id" /photos
          })
          .error(function(error){
            $scope.spinner = false;
            console.log("error", error);
          });
      },
      handle_date: function(field){
        var d = moment($scope.album[field + '_pretty']);
        var year = d._d.getFullYear();
        var month = add_zero(d._d.getMonth() + 1);
        var day = add_zero(d._d.getDate());
        $scope.album[field] = d._d.getTime();
        $scope.album[field + '_pretty'] = date_string(year, month, day);
      }
    };


    $scope.$watchCollection('album.start_date_pretty', function(newVal, oldVal){
      if(newVal){
        $scope.f.handle_date('start_date');
      }
    });

    $scope.$watchCollection('album.end_date_pretty', function(newVal, oldVal){
      if(newVal){
        $scope.f.handle_date('end_date');
      }
    });


  });
