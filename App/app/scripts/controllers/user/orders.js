'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserOrdersCtrl
 * @description
 * # UserOrdersCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/orders', {templateUrl: 'views/user/orders.html', controller: 'UserOrdersCtrl' })
      .when('/user/:id/order', {redirectTo: '/orders'})
  })
  .controller('UserOrdersCtrl', function ($scope, $location, $controller, $http, Iphotoshare) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    var search = $location.search();

    $scope.f = {
      get: function() {
        $http.get(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/orders')
          .success(function(data){
            $scope.orders = data;
            console.log($scope.orders);
          })

          .error(function(error){
          console.log('error getting orders');
        });
      }
    };

    $scope.f.get();
  });
