'use strict';

angular.module('iPhotoApp')
    .filter('objectivePhase', function () {
        return function(phase){
            switch(phase){
                case '1': return 'Prova 1';
                case '2': return 'Prova Biscuit';
                case '3': return 'Prova de Estrutura';
                case '4': return 'Pronto';
                default : return 'erro';
            }
        };
    });
