'use strict';

angular.module('iPhotoApp')
    .service('Labprotshare', function Labprotshare($cookieStore) {
        var url_prefix = 'http://localhost:8000';

        var user_types = {
            'A': 'admin',
            'LA': 'lab_admin',
            'CA': 'clinic_admin',
            'P': 'clinic_prescriber',
            'CR': 'clinic_rec',
            'LR': 'lab_rec',
            'T': 'lab_tec'
        };

        return {
            getUrl_Prefix: function () {
                return url_prefix;
            },
            getUser: function(){
              try {
                var user = $cookieStore.get('labprot-user');
                user.user_type = user_types[user.user_type];
                user.name = user.first_name + ' ' + user.last_name;
                return user;
              } catch(e){
                console.log('user not found!');
              }
            },
            getUserTypeMap: function(){
                return user_types;
            },
            getError: function(){
                return 'Erro inesperado no servidor, tente novamente e contacte o administrador do sistema.';
            }
        };
    });
