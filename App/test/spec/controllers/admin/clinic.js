'use strict';

describe('Controller: AdminClinicCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var AdminClinicCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminClinicCtrl = $controller('AdminClinicCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
