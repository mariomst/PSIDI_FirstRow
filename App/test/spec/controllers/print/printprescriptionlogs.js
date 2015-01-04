'use strict';

describe('Controller: PrintPrintprescriptionlogsCtrl', function () {

  // load the controller's module
  beforeEach(module('labprotApp'));

  var PrintPrintprescriptionlogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrintPrintprescriptionlogsCtrl = $controller('PrintPrintprescriptionlogsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
