'use strict';

describe('Controller: UserOrderConfirmationCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserOrderConfirmationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserOrderConfirmationCtrl = $controller('UserOrderConfirmationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
