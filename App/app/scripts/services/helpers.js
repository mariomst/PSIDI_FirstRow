'use strict';

angular.module('iPhotoApp').service('Helpers', function() {
  window.add_zero = function(number) {
    if (number < 10) {
      return '0' + number;
    } else {
      return '' + number;
    }
  };
  return window.date_string = function(y, m, d) {
    return '' + y + '/' + m + '/' + d;
  };
});
