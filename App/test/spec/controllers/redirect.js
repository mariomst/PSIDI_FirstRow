'use strict';

describe('Controller: RedirectCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var RedirectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RedirectCtrl = $controller('RedirectCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
