'use strict';

angular.module('iPhotoApp')
    .filter('productDetails', function () {
        return function(pd){
            return pd ? 'Sim' : 'Não';
        };
    });
