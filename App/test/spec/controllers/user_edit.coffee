'use strict'

describe 'Controller: UserEditCtrl', ->

  # load the controller's module
  beforeEach module 'labprotApp'

  UserEditCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UserEditCtrl = $controller 'UserEditCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
