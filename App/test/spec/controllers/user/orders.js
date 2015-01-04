'use strict';

describe('Controller: UserOrdersCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var UserOrdersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserOrdersCtrl = $controller('UserOrdersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
