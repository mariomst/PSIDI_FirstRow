'use strict';

angular.module('iPhotoApp')
    .filter('phase', function () {
        return function(phase){
            switch(phase){
                case 'PI': return 'Prescrito - Espera Estafeta';
                case 'CE': return 'Clínica - Entregue Estafeta';
                case 'LT': return 'Espera Trabalho Técnico';
                case 'LC': return 'Completo - Espera Estafeta';
                case 'LE': return 'Laboratório - Entregue Estafeta';
                case 'CR': return 'Clínica - Recebido';
                case 'PC': return 'Concluído';
                default : return 'erro';
            }
        };
    });
