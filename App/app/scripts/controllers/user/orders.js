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

    angular.extend($scope.f, {
      get: function() {
        $scope.spinner = true;
        $http.get(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/orders')
          .success(function(data){
            $scope.spinner = false;
            $scope.orders = data;
          })

          .error(function(error){
            $scope.f.handle_get_error();
            console.log('error getting orders ', error);
          });
      }
    });

    $scope.f.get();
  });
