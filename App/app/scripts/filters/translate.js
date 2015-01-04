'use strict';

angular.module('iPhotoApp')
    .filter('translate', function () {
        return function(string){
            switch(string){
                case 'User with this Username already exists.':
                    return 'Já existe um utilizador com o nome escolhido.';
                case 'Unable to login with provided credentials.':
                    return 'Não é possível entrar com as credenciais fornecidas.';
                default : return string;
            }
        };
    });
