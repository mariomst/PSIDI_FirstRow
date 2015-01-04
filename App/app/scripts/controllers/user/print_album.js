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
  .controller('UserPrintAlbumCtrl', function ($scope, $controller) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.print_album = {};
    $scope.print_album.photos = [];


    $scope.print_albums = [
      {
        "id": 1,
        "theme": "Férias",
        "title": "Melhores das férias",
        "message": "I will get a Triforce, like I said",
        "photos": [
          {
            "id": 1,
            "albumId": 1,
            "photo": "images/abc.jpg",
            "date": 1418066023321
          },
          {
            "id": 2,
            "albumId": 1,
            "photo": "images/abcd.jpg",
            "date": 1418066023321
          },
          {
            "id": 3,
            "albumId": 1,
            "photo": "images/abcde.jpg",
            "date": 1418066023321
          },
          {
            "id": 4,
            "albumId": 1,
            "photo": "images/abcdef.jpg",
            "date": 1418066023321
          },
          {
            "id": 5,
            "albumId": 1,
            "photo": "images/abcdefg.jpg",
            "date": 1418066023321
          }
        ]
      },
      {
        "title": "cenas",
        "photos": []
      }
    ];



    $scope.f = {
      makeTable: function(){
        for(var i = 0; i < $scope.print_albums.length; i++) {
          $scope.print_albums[i].tr = [];
          for (var j = 0; j < $scope.print_albums[i].photos.length; j++) {
            var td = [$scope.print_albums[i].photos[j]];
            if($scope.print_albums[i].photos[j +1 ]){
              td.push($scope.print_albums[i].photos[j + 1]);
              j++;
            }
            $scope.print_albums[i].tr.push(td);
          }
        }

      },
      submit: function(){
        console.log($scope.print_album);
      }
    };

    $scope.f.makeTable();
  });
