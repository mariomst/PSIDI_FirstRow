'use strict';

var constants = {
    //'serverAddress': '.../',
    'serverAddress': 'http://localhost\\:8000/',
    'resources': {
        'Album': {
            'endpoint': 'albums'
        },
        'Order': {
            'endpoint': 'orders'
        },
        'User': {
            'endpoint': 'users'
        },
        'PrintAlbum': {
            'endpoint': 'printAlbum'
        }
    }
};

var service = angular.module('iPhotoApp.services', ['ngResource']);

var resourceObjects = constants.resources;

for (var resource in resourceObjects) {
    if (resourceObjects.hasOwnProperty(resource)) {
        addResourceFactoryToService(service, resource, resourceObjects[resource].endpoint);
    }
}

function addResourceFactoryToService(service, resource, resourceEndPoint){
    service.factory(resource, function ($resource, $http, $cookieStore, Iphotoshare) {

        $http.defaults.headers.common['Authorization'] = 'Token ' + $cookieStore.get('djangotoken');

      console.log("cenas ->", Iphotoshare.getUser());

        return $resource(
                constants.serverAddress + resourceEndPoint + '/:id',
            // Creates a PUT method defined as 'update'
            {	id: '@id'},
            {
                update: {
                    method: 'PUT',
                    params: {id: '@id'}
                }
            }
        );
    });
}

