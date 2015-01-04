'use strict';

describe('Controller: AdminLaboratoriesCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var AdminLaboratoriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminLaboratoriesCtrl = $controller('AdminLaboratoriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
