'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/laboratory', {templateUrl: 'views/common/laboratory.html', controller: 'CommonLaboratoryCtrl' })
    })
    .controller('CommonLaboratoryCtrl', function ($scope, $location, $cookieStore, $http, Labprotshare) {

        $scope.spinner = true;

        $scope.user = Labprotshare.getUser();

        $scope.f = {
            stop: function(){
                $scope.spinner = false;
            },
            get: function(){
                $http.get(Labprotshare.getUrl_Prefix() + "/api/laboratories/"+$cookieStore.get('labprot-user').laboratory.id)
                    .success(function(data){
                        $scope.f.stop();
                        $scope.laboratory = data;
                    })
                    .error(function(error){
                        $scope.f.stop();
                        $scope.show_error = true;
                        $scope.error = Labprotshare.getError();
                    });
            }
        };

        $scope.f.get();
    });
