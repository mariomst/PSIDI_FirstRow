'use strict';

describe('Controller: AdminLaboratoryCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var AdminLaboratoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminLaboratoryCtrl = $controller('AdminLaboratoryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
