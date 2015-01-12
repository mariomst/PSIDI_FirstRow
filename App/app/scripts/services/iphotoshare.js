'use strict';

/**
 * @ngdoc service
 * @name iPhotoApp.Iphotoshare
 * @description
 * # Iphotoshare
 * Service in the iPhotoApp.
 */
angular.module('iPhotoApp')
  .service('Iphotoshare', function Iphotoshare($cookieStore) {

    var url_prefix = 'http://localhost:8000';

    return {
      getUrl_Prefix: function () {
        return url_prefix;
      },
      setUser: function(user){
        try {
          $cookieStore.remove("iphoto-user");
        } catch(error){

        }
        return $cookieStore.put("iphoto-user", user);
      },
      getUser: function(){
        return $cookieStore.get("iphoto-user");
      },
      getError: function(){
        return "Error getting information from the server.";
      },
      postError: function(){
        return "Error sending information to the server.";
      }
    };
  });
