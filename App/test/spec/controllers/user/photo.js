'use strict';

describe('Controller: UserPhotoCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserPhotoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserPhotoCtrl = $controller('UserPhotoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
