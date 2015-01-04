'use strict';

describe('Controller: ClinicPrescriberPrescriptionCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var ClinicPrescriberPrescriptionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClinicPrescriberPrescriptionCtrl = $controller('ClinicPrescriberPrescriptionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
