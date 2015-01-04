'use strict'

describe 'Service: Helpers', ->

  # load the service's module
  beforeEach module 'labprotApp'

  # instantiate service
  Helpers = {}
  beforeEach inject (_Helpers_) ->
    Helpers = _Helpers_

  it 'should do something', ->
    expect(!!Helpers).toBe true
