'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserOrderCtrl
 * @description
 * # UserOrderCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:id/order/create', {templateUrl: 'views/user/order_form.html', controller: 'UserOrderCtrl' })
  })
  .controller('UserOrderCtrl', function ($scope, $controller) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.order = {};

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
        "id": 3,
        "title": "cenas",
        "photos": []
      },
      {
        "id": 4,
        "title": "trinta",
        "photos": []
      },
      {
        "id": 5,
        "title": "bom album",
        "photos": []
      }
    ];

    $scope.f = {
      submit: function(){
        console.log($scope.order);
      }
    }
  });
