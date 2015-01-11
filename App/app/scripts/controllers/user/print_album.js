'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserPrintAlbumCtrl
 * @description
 * # UserPrintAlbumCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:id/print_album/create', {templateUrl: 'views/user/print_album_form.html', controller: 'UserPrintAlbumCtrl' })
  })
  .controller('UserPrintAlbumCtrl', function ($scope, $controller, $location, $http, Iphotoshare) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.print_album = {};
    $scope.print_album.photos = [];
    $scope.chosen_photos = [];

    $scope.f = {
      get: function(){
        $scope.spinner = true;
        $http.get(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/albums')
          .success(function(data){
            $scope.spinner = false;
            $scope.albums = data;
            $scope.f.makeTable();
          })
          .error(function(error){
            $scope.spinner = false;
            console.log("Error getting albums ", error);
            $scope.albums = [];
          });
      },


      makeTable: function(){
        for(var i = 0; i < $scope.albums.length; i++) {
          $scope.albums[i].tr = [];
          for (var j = 0; j < $scope.albums[i].photos.length; j++) {
            var td = [$scope.albums[i].photos[j]];
            if($scope.albums[i].photos[j +1 ]){
              td.push($scope.albums[i].photos[j + 1]);
              j++;
            }
            $scope.albums[i].tr.push(td);
          }
        }

      },
      submit: function(){
        $scope.spinner = true;
        var photos = [];
        for(var i = 0; i < $scope.albums.length; i++) {
          for (var j = 0; j < $scope.albums[i].photos.length; j++) {
            if($scope.chosen_photos[$scope.albums[i].photos[j].photoID]){
              //console.log("chosen photo = " + $scope.albums[i].photos[j].photoID);
              photos.push($scope.albums[i].photos[j].photoID);
            }
          }
        }

        $scope.print_album.photos = photos;
        console.log(JSON.stringify($scope.print_album));
        $http.post(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/printAlbums', $scope.print_album)
          .success(function(data){
            $scope.spinner = false;
            console.log("successfuly saved printalbum ", data);
            $location.path('/user');
          })
          .error(function(error){
            console.log("error saving printalbum ", error);
            $scope.spinner = false;
          });
      }
    };

    $scope.f.get();
  });
