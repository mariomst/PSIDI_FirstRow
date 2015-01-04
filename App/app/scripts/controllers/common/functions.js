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

    $scope.f = {};
  });
