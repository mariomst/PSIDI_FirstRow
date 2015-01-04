'use strict';

describe('Controller: ClinicRecPrescriptionCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var ClinicRecPrescriptionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClinicRecPrescriptionCtrl = $controller('ClinicRecPrescriptionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
