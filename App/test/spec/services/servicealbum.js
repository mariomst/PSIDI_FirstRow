'use strict';

describe('Service: Servicealbum', function () {

  // load the service's module
  beforeEach(module('iPhotoApp'));

  // instantiate service
  var Servicealbum;
  beforeEach(inject(function (_Servicealbum_) {
    Servicealbum = _Servicealbum_;
  }));

  it('should do something', function () {
    expect(!!Servicealbum).toBe(true);
  });

});
