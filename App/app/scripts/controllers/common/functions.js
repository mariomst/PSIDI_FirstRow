'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:CommonFunctionsCtrl
 * @description
 * # CommonFunctionsCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .controller('CommonFunctionsCtrl', function ($scope, Iphotoshare) {

    $scope.user = Iphotoshare.getUser();

    $scope.errors = [];

    $scope.f = {
      handle_get_error: function(){
        $scope.spinner = false;
        $scope.show_error = true;
        $scope.errors.push(Iphotoshare.getError());
      },
      handle_post_error: function(){
        $scope.spinner = false;
        $scope.show_error = true;
        $scope.errors.push(Iphotoshare.postError());
      }
    };
  });
