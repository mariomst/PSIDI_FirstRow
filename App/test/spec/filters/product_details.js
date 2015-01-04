'use strict';

describe('Filter: productDetails', function () {

  // load the filter's module
  beforeEach(module('labprotApp'));

  // initialize a new instance of the filter before each test
  var productDetails;
  beforeEach(inject(function ($filter) {
    productDetails = $filter('productDetails');
  }));

  it('should return the input prefixed with "productDetails filter:"', function () {
    var text = 'angularjs';
    expect(productDetails(text)).toBe('productDetails filter: ' + text);
  });

});
