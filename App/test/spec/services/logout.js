'use strict';

describe('Service: Logout', function () {

  // load the service's module
  beforeEach(module('labprotApp'));

  // instantiate service
  var Logout;
  beforeEach(inject(function (_Logout_) {
    Logout = _Logout_;
  }));

  it('should do something', function () {
    expect(!!Logout).toBe(true);
  });

});
