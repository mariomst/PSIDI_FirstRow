'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin/clinic/add', {templateUrl: 'views/admin/clinic_form.html', controller: 'AdminClinicCtrl' })
    })
    .controller('AdminClinicCtrl', function ($scope, $location, $http, $cookieStore, Clinic, Laboratory, Labprotshare) {

        $scope.spinner = true;

        $scope.user = Labprotshare.getUser();

        $scope.clinic = {};

        $("#clinic_name").focus();

        if($location.search()['clinic']){
            $http.get(Labprotshare.getUrl_Prefix() + "/api/clinics/"+$location.search()['clinic']).success(function(data){
                $scope.clinic = data;
            });
        }

        $scope.f = {
            stop: function() {
                $scope.spinner = false;
            },
            get: function() {
                $scope.laboratories = Laboratory.query(function(data){
                    $scope.f.stop();
                }, function(error){
                    $scope.f.stop();
                    $scope.show_error = true;
                    $scope.error = Labprotshare.getError();
                });
            },
            go_back : function(){
                $location.path("/admin/clinics");
            },
            reset : function(index){
                $scope["clinic_" + index] = false;
            },
            validate : function(index) {
                if(!$scope.clinic[index]){
                    $scope.valid = false;
                    $scope["clinic_" + index] = true;
                }
            },
            evaluate: function(){
                if($scope.submited){
                    $scope.valid = true;
                    var fields = ["name", "address", "zipcode1", "zipcode2", "laboratory", "city"];

                    angular.forEach(fields, $scope.f.reset);
                    angular.forEach(fields, $scope.f.validate);
                }
            },
            submit : function(){
                $scope.submited = true;

                $scope.valid = true;
                var fields = ["name", "address", "zipcode1", "zipcode2", "laboratory", "city"];

                angular.forEach(fields, $scope.f.reset);
                angular.forEach(fields, $scope.f.validate);

                if($scope.valid){
                    if($location.search()['clinic']){
                        Clinic.update({id: $scope.clinic.id}, $scope.clinic, function(resource){
                            var notification = "Clínica "+ resource.name +" actualizada com successo.";
                            $cookieStore.put('labprot-notification', notification);
                            $location.path("/admin/clinics");
                        });
                    } else {
                        Clinic.save($scope.clinic, function(resource){
                            var notification = "Clínica "+ resource.name +" criada com successo.";
                            $cookieStore.put('labprot-notification', notification);
                            $location.path("/admin/clinics");
                        }, function(error){
                            //TODO: errors
                            $scope.show_error = true;
                            $scope.error = error;
                        });
                    }
                }
            }
        };

        $scope.$watch('clinic.laboratory', function(newVal, oldVal){
            if(newVal!=oldVal){
                $scope["clinic_laboratory"] = false;
            }
        });

        $scope.f.get();

    });
