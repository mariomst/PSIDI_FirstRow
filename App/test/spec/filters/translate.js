'use strict';

describe('Filter: translate', function () {

  // load the filter's module
  beforeEach(module('labprotApp'));

  // initialize a new instance of the filter before each test
  var translate;
  beforeEach(inject(function ($filter) {
    translate = $filter('translate');
  }));

  it('should return the input prefixed with "translate filter:"', function () {
    var text = 'angularjs';
    expect(translate(text)).toBe('translate filter: ' + text);
  });

});
