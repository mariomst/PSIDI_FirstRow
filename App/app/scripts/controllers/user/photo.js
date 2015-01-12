'use strict';

/**
 * @ngdoc function
 * @name iPhotoApp.controller:UserPhotoCtrl
 * @description
 * # UserPhotoCtrl
 * Controller of the iPhotoApp
 */
angular.module('iPhotoApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:user/album/:album/photo', {templateUrl: 'views/user/photo_form.html', controller: 'UserPhotoCtrl' })
  })
  .controller('UserPhotoCtrl', function ($scope, $controller, $location, $routeParams, FileUploader, Iphotoshare) {

    angular.extend(this, $controller('CommonFunctionsCtrl', {$scope: $scope}));

    $scope.uploader = new FileUploader({
      url: Iphotoshare.getUrl_Prefix() + '/users/' + $routeParams.user + '/albums/' + $routeParams.album + '/photos'
    });

    angular.extend($scope.f, {

      submit: function () {
        $scope.spinner = true;
        for (var i = 0; i < $scope.uploader.queue.length; i++) {
          $scope.uploader.queue[i].upload();
        }
      }
    });



    $scope.uploader.onBeforeUploadItem = function(item) {
      var index = $scope.uploader.getIndexOfItem(item);
      item.formData.push({description: $scope.uploader.queue[index].file.description});
      item.formData.push({date: moment()._d.getTime()});
    };

    $scope.uploader.onCompleteAll = function() {
      $scope.spinner = false;
      $location.path('/user');
    };

  });
