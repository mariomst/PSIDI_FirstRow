'use strict';

describe('Controller: AdminClinicsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var AdminClinicsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminClinicsCtrl = $controller('AdminClinicsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
