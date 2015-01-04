'use strict';

describe('Service: spinner', function () {

  // load the service's module
  beforeEach(module('labprotApp'));

  // instantiate service
  var spinner;
  beforeEach(inject(function (_spinner_) {
    spinner = _spinner_;
  }));

  it('should do something', function () {
    expect(!!spinner).toBe(true);
  });

});
