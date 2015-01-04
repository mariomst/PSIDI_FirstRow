'use strict';

describe('Controller: UserOrderCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserOrderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserOrderCtrl = $controller('UserOrderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
