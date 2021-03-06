'use strict';

describe('Controller: UserPrintAlbumCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserPrintAlbumCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserPrintAlbumCtrl = $controller('UserPrintAlbumCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
