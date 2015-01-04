'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin/clinics', {templateUrl: 'views/admin/clinics.html', controller: 'AdminClinicsCtrl' })
    })
    .controller('AdminClinicsCtrl', function ($scope, $location, $modal, $cookieStore, Clinic, Laboratory, Labprotshare) {

        $scope.spinner = true;

        $scope.user = Labprotshare.getUser();

        $scope.notification = $cookieStore.get('labprot-notification');

        $scope.show_info = false;

        if($scope.notification){
            $scope.show_info = true;
            $cookieStore.remove('labprot-notification');
        }

        $scope.f = {
            stop : function() {
                $scope.spinner = false;
            },
            get: function(){
                $scope.laboratories = Laboratory.query(function(data){
                    $scope.f.stop();
                }, function(error){
                    $scope.f.stop();
                    $scope.show_error = true;
                    $scope.error = Labprotshare.getError();
                });

                $scope.clinics = Clinic.query(function(data){
                    $scope.f.stop();
                }, function(error){
                    $scope.f.stop();
                    $scope.show_error = true;
                    $scope.error = Labprotshare.getError();
                });
            },

            delete_clinic: function(clinic){
                Clinic.delete({id: clinic}, function(resource){
                    var oldClinics = $scope.clinics;
                    $scope.clinics = [];

                    angular.forEach(oldClinics, function(c){
                        if(c.id != clinic.id) $scope.clinics.push(c);
                    });
                    $scope.show_info = true;
                    $scope.notification = "Clínica apagada com sucesso.";
                }, function(response){
                    $scope.show_error = true;
                    $scope.error = "É impossível apagar uma clínica com utilizadores associados.";
                });

            },
            open: function(object){
                var modal = $modal.open({
                    templateUrl: 'views/modals/delete.html',
                    controller: ModalDeleteClinic,
                    size: 'sm',
                    resolve: {
                        object: function () {
                            return object;
                        }
                    }
                });

                modal.result.then(function (clinic) {
                    $scope.f.delete_clinic(clinic);
                }, function () {
                    //on cancel
                });
            }
        };

        $scope.f.get();

    });

var ModalDeleteClinic = ['$scope', '$modalInstance', 'object', function ($scope, $modalInstance, object) {

    $scope.object = object;

    $scope.delete = function () {
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}];
