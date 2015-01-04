'use strict';

angular
    .module('iPhotoApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'angularSpinner',
        'iPhotoApp.services',
        'ui.bootstrap',
        'ui.select2',
        'ui.bootstrap.datetimepicker',
        'angularFileUpload'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/logout', { templateUrl: 'views/login.html', controller:'LogoutCtrl'})
            .when('/', { templateUrl: 'views/login.html', controller:'RedirectCtrl'})
            .otherwise({redirectTo:'/'});

    });
