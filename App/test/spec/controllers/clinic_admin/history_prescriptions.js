'use strict';

describe('Controller: ClinicAdminHistoryPrescriptionsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var ClinicAdminHistoryPrescriptionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClinicAdminHistoryPrescriptionsCtrl = $controller('ClinicAdminHistoryPrescriptionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
