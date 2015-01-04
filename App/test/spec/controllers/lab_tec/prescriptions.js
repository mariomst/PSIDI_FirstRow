'use strict';

describe('Controller: LabTecPrescriptionsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var LabTecPrescriptionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabTecPrescriptionsCtrl = $controller('LabTecPrescriptionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
