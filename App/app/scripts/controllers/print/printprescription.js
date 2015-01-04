'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/prescription/print', { templateUrl: 'views/print/prescription.html', controller:'PrintPrintprescriptionCtrl'})
    })

    .controller('PrintPrintprescriptionCtrl', function ($scope, $location, $http, Prescription, $cookieStore, Labprotshare) {

        $scope.user = Labprotshare.getUser();

        $scope.selected_products = [];

        $scope.teeth = {};
        $scope.colors = {};

        $scope.prescriber = $cookieStore.get("labprot-user").first_name + " " + $cookieStore.get("labprot-user").last_name;
        $scope.clinic = $cookieStore.get("labprot-user").clinic;
        if($location.search()['prescription']){
            $http.get(Labprotshare.getUrl_Prefix() + "/api/prescriptions/"+$location.search()['prescription']).success(function(data){
                $scope.prescription = data;
                try{
                    var json = JSON.parse($scope.prescription.products[0].arch_json);
                    $scope.prescription.arch_teeth = JSON.parse(json.arch_teeth);
                    $scope.prescription.arch_colors = JSON.parse(json.arch_colors);
                } catch (err){}
                angular.forEach($scope.prescription.products, function(product){
                    product.code = product.product.code;
                    product.name = product.product.name;
                    $scope.selected_products.push(product);
                });
                window.print();
            });
        }

        $scope.superior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];

        $scope.inferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    });
