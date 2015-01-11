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
  .controller('UserOrderCtrl', function ($scope, $controller, $http, $location, Iphotoshare) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.order = {};
    $scope.order.confirmed = false;

    $scope.f = {
      get: function(){
        $scope.spinner = true;
        $http.get(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/printAlbums')
          .success(function(data){
            $scope.spinner = false;
            $scope.print_albums = data;
          })
          .error(function(error){
            $scope.spinner = false;
            console.log("error getting print_albums");
          });
      },
      submit: function(){
        $scope.spinner = true;
        console.log($scope.order);
        $http.post(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/orders', $scope.order)
          .success(function(data){
            $scope.spinner = false;
            console.log("Order placed -> ", data);
            $location.path('/user/' + $scope.user.userID + '/order/' + data.orderID + '/confirm');

          })
          .error(function(error){
            $scope.spinner = false;
            console.log("Error placing order", error);
          });
      }
    };

    $scope.f.get();
  });
