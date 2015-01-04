'use strict';

angular.module('iPhotoApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin/user/add', {templateUrl: 'views/admin/user_form.html', controller: 'AdminUserCtrl' })
    })
    .controller('AdminUserCtrl', function ($scope, $location, $http, $cookieStore, Laboratory, User, Clinic, Labprotshare) {

        $scope.spinner = true;

        $scope.user = Labprotshare.getUser();

        $scope.form_user = {};

        $scope.edit = $location.search()['user'];

        $("#user_first_name").focus();


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

                $scope.clinics = Clinic.query(function(data){
                    $scope.f.stop();
                }, function(error){
                    $scope.f.stop();
                    $scope.show_error = true;
                    $scope.error = Labprotshare.getError();
                });
            },
            go_back: function() {
                $location.path("/admin");
            },
            reset: function(index) {
                $scope["user_" + index] = false;
            },
            validate: function(index) {
                if(!$scope.form_user[index]){
                    if(index=="clinic"){
                        switch($scope.form_user.user_type){
                            case "CR":
                            case "P":
                            case "CA":
                                $scope.valid = false;
                                $scope["user_" + index] = true;
                                break;
                        }
                    } else if (index == "laboratory"){
                        switch($scope.form_user.user_type){
                            case "LA":
                            case "T":
                            case "LR":
                                $scope.valid = false;
                                $scope["user_" + index] = true;
                                break;
                        }
                    } else if (index == "professional_id"){
                        if($scope.form_user.user_type == "P"){
                            $scope.valid = false;
                            $scope["user_" + index] = true;
                        }
                    }
                    else {
                        $scope.valid = false;
                        $scope["user_" + index] = true;
                    }
                }
            },
            evaluate: function(){
                if($scope.submited){
                    $scope.valid = true;

                    var fields = ["first_name", "last_name", "username", "email", "user_type", "clinic", "laboratory", "password", "password_confirm", "professional_id"];

                    angular.forEach(fields, $scope.f.reset);
                    angular.forEach(fields, $scope.f.validate);
                }
            },
            submit: function() {
                $scope.submited = true;

                $scope.valid = true;

                var fields = ["first_name", "last_name", "username", "email", "user_type", "clinic", "laboratory", "password", "password_confirm", "professional_id"];

                angular.forEach(fields, $scope.f.reset);
                angular.forEach(fields, $scope.f.validate);

                if ($scope.valid) {
                    if ($scope.form_user.password == $scope.form_user.password_confirm) {
                        if ($scope.edit) {
                            User.update({id: $scope.form_user.username}, $scope.user, function (resource) {
                                var notification = "Utilizador " + $scope.form_user.username + " actualizado com successo.";
                                $cookieStore.put('labprot-notification', notification);
                                $location.path("/admin");
                            });
                        } else {
                            User.save($scope.form_user, function (resource) {
                                var notification = "Utilizador " + $scope.form_user.username + " criado com successo.";
                                $cookieStore.put('labprot-notification', notification);
                                $location.path("/admin");
                            }, function (data) {
                                $scope.show_error = true;
                                $scope.error = data.data.username[0];
                            });
                        }
                    } else {
                        $scope.show_error = true;
                        $scope.error = "As passwords não coincidem."
                    }
                }
            }

        };

        if($scope.edit){
            $http.get(Labprotshare.getUrl_Prefix() + "/api/users/"+$scope.edit).success(function(data){
                $scope.user = data;
                try { $scope.form_user.laboratory = data.laboratory.id; } catch(Error){}
                try { $scope.form_user.clinic = data.clinic.id; } catch(Error){}
            });
        }

        $scope.details = [
            {
                "value": "A",
                "description": "Administrador"
            },
            {
                "value": "LA",
                "description": "Administrador de Laboratório"
            },
            {
                "value": "LR",
                "description": "Receção de Laboratório"
            },
            {
                "value": "T",
                "description": "Técnico de Laboratório"
            },
            {
                "value": "CA",
                "description": "Administrador de Clínica"
            },
            {
                "value": "CR",
                "description": "Receção de Clínica"
            },
            {
                "value": "P",
                "description": "Prescritor"
            }
        ];


        $scope.$watch("form_user.user_type", function(newVal,oldVal){
            if(newVal!=oldVal){
                $scope["user_user_type"] = false;
            }
        });

        $scope.$watch("form_user.laboratory", function(newVal,oldVal){
            if(newVal!=oldVal){
                $scope["user_laboratory"] = false;
            }
        });

        $scope.$watch("form_user.clinic", function(newVal,oldVal){
            if(newVal!=oldVal){
                $scope["user_clinic"] = false;
            }
        });

        $scope.f.get();

    });
