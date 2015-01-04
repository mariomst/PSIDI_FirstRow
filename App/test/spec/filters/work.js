'use strict';

describe('Filter: work', function () {

  // load the filter's module
  beforeEach(module('labprotApp'));

  // initialize a new instance of the filter before each test
  var work;
  beforeEach(inject(function ($filter) {
    work = $filter('work');
  }));

  it('should return the input prefixed with "work filter:"', function () {
    var text = 'angularjs';
    expect(work(text)).toBe('work filter: ' + text);
  });

});
