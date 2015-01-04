'use strict';

describe('Service: Iphotoshare', function () {

  // load the service's module
  beforeEach(module('iPhotoApp'));

  // instantiate service
  var Iphotoshare;
  beforeEach(inject(function (_Iphotoshare_) {
    Iphotoshare = _Iphotoshare_;
  }));

  it('should do something', function () {
    expect(!!Iphotoshare).toBe(true);
  });

});
