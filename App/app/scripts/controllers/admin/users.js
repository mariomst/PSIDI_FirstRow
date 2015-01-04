'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin/users', {templateUrl: 'views/admin/users.html', controller: 'AdminUsersCtrl' })
    })
    .controller('AdminUsersCtrl', function ($scope, $location, $modal, $cookieStore, Clinic, Labprotshare, User) {

        $scope.spinner = true;

        $scope.user = Labprotshare.getUser();

        $scope.notification = $cookieStore.get('labprot-notification');

        $scope.show_info = false;

        if($scope.notification){
            $scope.show_info = true;
            $cookieStore.remove('labprot-notification');
        }

        $scope.clinic = $location.search()['clinic'];
        $scope.laboratory = $location.search()['laboratory'];

        $scope.f = {
            stop : function() {
                $scope.spinner = false;
            },
            get: function(laboratory, clinic){
                if(laboratory){
                    $scope.title = "Pessoal do Laboratório";
                    $scope.title2 = "Clínicas";
                    $scope.clinics = Clinic.query({"laboratory":$location.search()['laboratory']},function(data){

                    }, function(error){
                        $scope.show_error = true;
                        $scope.error = Labprotshare.getError();
                    });

                    $scope.users = User.query({"laboratory":laboratory}, function(data){

                    }, function(error){
                        $scope.show_error = true;
                        $scope.error = Labprotshare.getError();
                    });
                }
                if(clinic){
                    $scope.title = "Pessoal da Clínica";
                    $scope.users = User.query({"clinic":clinic}, function(data){

                    }, function(error){
                        $scope.show_error = true;
                        $scope.error = Labprotshare.getError();
                    });
                }
                $scope.clinics = Clinic.query(function(data){
                    $scope.f.stop();
                }, function(error){
                    $scope.f.stop();
                    $scope.show_error = true;
                    $scope.error = Labprotshare.getError();
                });
            },
            delete_clinic: function(clinic){
                Clinic.delete({id: clinic.id}, function(resource){
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
            delete_user: function(user){
                User.delete({id: user.username}, function(resource){
                    var oldUsers = $scope.users;
                    $scope.users = [];

                    angular.forEach(oldUsers, function(u){
                        if(u.id != user.id) $scope.users.push(u);
                    });
                    $scope.show_info = true;
                    $scope.notification = "Utilizador apagado com sucesso.";
                }, function(response){
                    $scope.show_error = true;
                    $scope.error = "É impossível apagar um utilizador que tenha contribuído para a aplicação.";
                });
            },
            open: function(object){
                var modal = $modal.open({
                    templateUrl: 'views/modals/delete.html',
                    controller: ModalDelete,
                    size: 'sm',
                    resolve: {
                        object: function () {
                            return object;
                        }
                    }
                });

                modal.result.then(function (object) {
                    if(object.username){
                        $scope.f.delete_user(object);
                    } else {
                        $scope.f.delete_clinic(object);
                    }
                }, function () {
                    //on cancel
                });
            }
        };

        if($scope.laboratory){
            $scope.type = 'laboratory';
        } else if ($scope.clinic){
            $scope.type = 'clinic';
        }

        $scope.f.get($scope.laboratory, $scope.clinic);

    });

var ModalDelete = ['$scope', '$modalInstance', 'object', function ($scope, $modalInstance, object) {

    $scope.object = object;

    $scope.delete = function () {
        $modalInstance.close($scope.object);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}];
