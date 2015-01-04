'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin/laboratory/add', {templateUrl: 'views/admin/laboratory_form.html', controller: 'AdminLaboratoryCtrl' })
    })
    .controller('AdminLaboratoryCtrl', function ($scope, $location, $cookieStore, Laboratory, Labprotshare) {

        $scope.laboratory = {};

        $scope.user = Labprotshare.getUser();

        $("#laboratory_name").focus();

        if($location.search()['lab']){
            $http.get(Labprotshare.getUrl_Prefix() + "/api/laboratories/"+$location.search()['lab']).success(function(data){
                $scope.laboratory = data;
            });
        }

        $scope.submit_once = false;

        $scope.f = {
            go_back: function() {
                $location.path("/admin/laboratories");
            },
            reset: function(index){
                $scope["laboratory_" + index] = false;
            },
            validate: function(index){
                if(!$scope.laboratory[index]){
                    $scope.valid = false;
                    $scope["laboratory_" + index] = true;
                }
            },
            evaluate: function(){
                if($scope.submited){
                    $scope.valid = true;

                    var fields = ["name", "address", "zipcode1", "zipcode2", "email", "city"];

                    angular.forEach(fields, $scope.f.reset);
                    angular.forEach(fields, $scope.f.validate);
                }
            },
            submit: function(){
                $scope.submited = true;

                $scope.valid = true;

                var fields = ["name", "address", "zipcode1", "zipcode2", "email", "city"];

                angular.forEach(fields, $scope.f.reset);
                angular.forEach(fields, $scope.f.validate);

                if($scope.valid){
                    if($location.search()['lab']){
                        if(!$scope.submit_once){
                            Laboratory.update({id: $scope.laboratory.id}, $scope.laboratory, function(resource){
                                var notification = "Laboratório "+ resource.name +" actualizado com successo.";
                                $cookieStore.put('labprot-notification', notification);
                                $location.path("/admin/laboratories");
                            });
                            $scope.submit_once = true;
                        }
                    } else {
                        if(!$scope.submit_once) {
                            Laboratory.save($scope.laboratory, function (resource) {
                                var notification = "Laboratório " + resource.name + " criado com successo.";
                                $cookieStore.put('labprot-notification', notification);
                                $location.path("/admin/laboratories");
                            }, function (error) {
                                $scope.show_error = true;
                                $scope.error = error;
                            });
                            $scope.submit_once = true;
                        }
                    }
                }
            }
        };
    });
