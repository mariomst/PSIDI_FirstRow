'use strict';

describe('Controller: UserAlbumCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserAlbumCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserAlbumCtrl = $controller('UserAlbumCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
