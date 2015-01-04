'use strict';

angular.module('iPhotoApp')
    .service('Logout', function Logout($scope, $cookieStore) {
        try {
            $scope.username = $cookieStore.get('labprot-user').username;
            $scope.name = $cookieStore.get('labprot-user').first_name + ' ' + $cookieStore.get('labprot-user').last_name;
        } catch(error) {}

        return {
            logout: function () {
                $cookieStore.remove('djangotoken');
                $cookieStore.remove('labprot-user');
                $location.path('/login');
            }
        };
    });
