'use strict';

describe('Controller: ClinicPrescriberPrescriptionsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var ClinicPrescriberPrescriptionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClinicPrescriberPrescriptionsCtrl = $controller('ClinicPrescriberPrescriptionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
