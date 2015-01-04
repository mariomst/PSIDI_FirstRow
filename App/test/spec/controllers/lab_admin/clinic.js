'use strict';

describe('Controller: LabAdminClinicCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var LabAdminClinicCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabAdminClinicCtrl = $controller('LabAdminClinicCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
