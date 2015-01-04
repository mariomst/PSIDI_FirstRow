'use strict';

describe('Controller: LabRecPrescriptionsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var LabRecPrescriptionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabRecPrescriptionsCtrl = $controller('LabRecPrescriptionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
