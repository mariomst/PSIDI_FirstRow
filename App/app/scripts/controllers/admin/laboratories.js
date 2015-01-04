'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin', {templateUrl: 'views/admin/labs.html', controller: 'AdminLaboratoriesCtrl' })
            .when('/admin/laboratories', {redirectTo: '/admin'})
    })
    .controller('AdminLaboratoriesCtrl', function ($scope, $http, $q, $cookieStore, $modal, usSpinnerService, Labprotshare, Laboratory) {

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
            },
            delete_laboratory: function(laboratory){
                Laboratory.delete({id: laboratory.id}, function(resource){
                    var oldLaboratories = $scope.laboratories;
                    $scope.laboratories = [];

                    angular.forEach(oldLaboratories, function(l){
                        if(l.id != laboratory.id) $scope.laboratories.push(l);
                    });
                    $scope.show_info = true;
                    $scope.notification = "Laboratório apagado com sucesso.";
                }, function(response){
                    $scope.show_error = true;
                    $scope.error = "É impossível apagar um laboratório com clínicas ou utilizadores associados.";
                });
            },
            open: function(object){
                var modal = $modal.open({
                    templateUrl: 'views/modals/delete.html',
                    controller: ModalDeleteLab,
                    size: 'sm',
                    resolve: {
                        object: function () {
                            return object;
                        }
                    }
                });

                modal.result.then(function (laboratory) {
                    $scope.f.delete_laboratory(laboratory);
                }, function () {
                    //on cancel
                });
            }
        };

        $scope.f.get();

    });


var ModalDeleteLab = ['$scope', '$modalInstance', 'object', function ($scope, $modalInstance, object) {

    $scope.object = object;

    $scope.delete = function () {
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}];
