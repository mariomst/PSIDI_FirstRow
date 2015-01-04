'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/prescription_logs/print', { templateUrl: 'views/print/prescriptionlogs.html', controller:'PrintPrintprescriptionlogsCtrl'})
    })
    .controller('PrintPrintprescriptionlogsCtrl', function ($scope, $location, $http, Prescription, Labprotshare) {

        if($location.search()['prescription']){
            $http.get(Labprotshare.getUrl_Prefix() + "/api/prescriptions/"+$location.search()['prescription']).success(function(data){
                $scope.prescription = data;
                $http.get(Labprotshare.getUrl_Prefix() + "/api/prescription_logs?prescription="+$location.search()['prescription']).success(function(data){
                    $scope.logs = data;
                    $('.navbar').hide();
                    window.print();
                });
            });



        }
    });
