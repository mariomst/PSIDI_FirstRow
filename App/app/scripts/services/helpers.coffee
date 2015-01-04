'use strict'

angular.module('iPhotoApp')
  .service 'Helpers', ->
    # AngularJS will instantiate a singleton by calling "new" on this function
    window.add_zero = (number) -> if number < 10 then "0" + number else "" + number
    window.date_string = (y, m, d) -> "" + y + "/" + m + "/" + d
