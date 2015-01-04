'use strict';

angular.module('iPhotoApp')
    .controller('RedirectCtrl', function ($scope, $location, $cookieStore, Labprotshare) {

        try{
            if($cookieStore.get('labprot-user') && $cookieStore.get('djangotoken')){
                $scope.user = Labprotshare.getUser();
                $location.path('/' + $scope.user.user_type);
            } else {
                $location.path('/login');
            }

        } catch (error){
            $location.path('/login');
        }

    });
