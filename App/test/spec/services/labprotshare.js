'use strict';

describe('Service: Labprotshare', function () {

  // load the service's module
  beforeEach(module('labprotApp'));

  // instantiate service
  var Labprotshare;
  beforeEach(inject(function (_Labprotshare_) {
    Labprotshare = _Labprotshare_;
  }));

  it('should do something', function () {
    expect(!!Labprotshare).toBe(true);
  });

});
