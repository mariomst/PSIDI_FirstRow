'use strict';

describe('Controller: CommonFunctionsCtrl', function () {

  // load the controller's module
  beforeEach(module('iPhotoApp'));

  var CommonFunctionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommonFunctionsCtrl = $controller('CommonFunctionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
