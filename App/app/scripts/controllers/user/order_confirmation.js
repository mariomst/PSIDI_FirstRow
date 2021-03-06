'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserOrderConfirmationCtrl
 * @description
 * # UserOrderConfirmationCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:user/order/:order/confirm', {templateUrl: 'views/user/order_confirmation_form.html', controller: 'UserOrderConfirmationCtrl' })
  })
  .controller('UserOrderConfirmationCtrl', function ($scope, $controller, $http, $location, $routeParams, Iphotoshare) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.order = {};

    angular.extend($scope.f, {
      get: function(){
        $scope.spinner = true;
        $http.get(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/orders/' + $routeParams.order)
          .success(function(data){
            $scope.spinner = false;
            $scope.order = data;
          })
          .error(function(error){
            $scope.f.handle_get_error();
            console.log("error getting order -", error);
          });
      },
      submit: function(){
        $scope.spinner = true;
        $scope.order.confirmed = true;
        console.log($scope.order);
        $http.post(Iphotoshare.getUrl_Prefix() + '/users/' + $scope.user.userID + '/orders/' + $scope.order.orderID, $scope.order)
          .success(function(data){
            $scope.spinner = false;
            $location.path('/user/' + $scope.user.userID + '/order');
          })
          .error(function(error){
            console.log("Error placing order", error);
            $scope.f.handle_post_error();
          });
      }
    });

    $scope.f.get();
  });
