'use strict';

describe('Controller: LabAdminUserCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var LabAdminUserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabAdminUserCtrl = $controller('LabAdminUserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
