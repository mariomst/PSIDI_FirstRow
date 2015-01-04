'use strict';

describe('Controller: LabAdminClinicsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var LabAdminClinicsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabAdminClinicsCtrl = $controller('LabAdminClinicsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
