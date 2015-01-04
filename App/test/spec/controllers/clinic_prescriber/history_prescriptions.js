'use strict';

describe('Controller: ClinicPrescriberHistoryPrescriptionsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var ClinicPrescriberHistoryPrescriptionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClinicPrescriberHistoryPrescriptionsCtrl = $controller('ClinicPrescriberHistoryPrescriptionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
