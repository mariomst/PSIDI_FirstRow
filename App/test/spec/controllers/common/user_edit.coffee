'use strict'

describe 'Controller: CommonUserEditCtrl', ->

  # load the controller's module
  beforeEach module 'labprotApp'

  CommonUserEditCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    CommonUserEditCtrl = $controller 'CommonUserEditCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
