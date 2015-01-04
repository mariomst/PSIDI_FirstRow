'use strict'

describe 'Controller: HistoryPrescriptionsCtrl', ->

  # load the controller's module
  beforeEach module 'labprotApp'

  HistoryPrescriptionsCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    HistoryPrescriptionsCtrl = $controller 'HistoryPrescriptionsCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
