'use strict';

describe('Filter: objectivePhase', function () {

  // load the filter's module
  beforeEach(module('labprotApp'));

  // initialize a new instance of the filter before each test
  var objectivePhase;
  beforeEach(inject(function ($filter) {
    objectivePhase = $filter('objectivePhase');
  }));

  it('should return the input prefixed with "objectivePhase filter:"', function () {
    var text = 'angularjs';
    expect(objectivePhase(text)).toBe('objectivePhase filter: ' + text);
  });

});
