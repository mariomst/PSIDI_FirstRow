'use strict';

angular.module('iPhotoApp')
    .controller('LogoutCtrl', function ($scope, $cookieStore, $location) {

        $cookieStore.remove('djangotoken');
        $cookieStore.remove('labprot-user');
        $location.path('/login');

    });
