'use strict';

angular.module('iPhotoApp')
    .filter('work', function () {
        return function(work){
            switch(work){
                case 'A': return 'Administrador';
                case 'LA': return 'Administrador de Laboratório';
                case 'CA': return 'Administrador da Clínica';
                case 'T': return 'Técnico de Laboratório';
                case 'LR': return 'Receção de Laboratório';
                case 'P': return 'Prescritor de Clínica';
                case 'CR': return 'Receção de Clínica';
                default : return 'erro';
            }
        };
    });
