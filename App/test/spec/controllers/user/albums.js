'use strict';

describe('Controller: UserAlbumsCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserAlbumsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserAlbumsCtrl = $controller('UserAlbumsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
