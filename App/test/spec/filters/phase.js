'use strict';

describe('Filter: phase', function () {

  // load the filter's module
  beforeEach(module('labprotApp'));

  // initialize a new instance of the filter before each test
  var phase;
  beforeEach(inject(function ($filter) {
    phase = $filter('phase');
  }));

  it('should return the input prefixed with "phase filter:"', function () {
    var text = 'angularjs';
    expect(phase(text)).toBe('phase filter: ' + text);
  });

});
