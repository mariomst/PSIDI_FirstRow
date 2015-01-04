'use strict'

describe 'Service: ServicesHelpers', ->

  # load the service's module
  beforeEach module 'labprotApp'

  # instantiate service
  ServicesHelpers = {}
  beforeEach inject (_ServicesHelpers_) ->
    ServicesHelpers = _ServicesHelpers_

  it 'should do something', ->
    expect(!!ServicesHelpers).toBe true
