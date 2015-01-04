'use strict';

/**
 * @ngdoc service
 * @name iPhotoApp.Servicealbum
 * @description
 * # Servicealbum
 * Service in the iPhotoApp.
 */
angular.module('iPhotoApp.ServiceAlbum')
  .factory('ServiceAlbum', function($resource, Iphotoshare) {

    var user = {};
    try{
      user = Iphotoshare.getUser();
    } catch(error){
      console.log("error at servicealbum -> ", error);
    }

    var Album = $resource('/users/' + user.userID + '/albums/:id', {}, {
      destroy: {method: 'DELETE'},
      update: {method: 'PUT'}
    });


    Album.prototype.update = function(cb) {
      return Album.update({id: this._id.$oid},
        angular.extend({}, this, {_id:undefined}), cb);
    };

    Album.prototype.destroy = function(cb) {
      return Album.remove({id: this._id.$oid}, cb);
    };


    return Album;
  });
