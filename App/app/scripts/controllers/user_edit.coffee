'use strict'

angular.module('iPhotoApp')
.config(
  ($routeProvider) -> $routeProvider.when "/user/edit",
    templateUrl: "views/common/user_edit.html"
    controller: "UserEditCtrl"
)
.controller 'UserEditCtrl', ($scope, $location, $cookieStore, Labprotshare, User) ->
  $scope.user = Labprotshare.getUser()
  $scope.old = true
  $scope.notification = $cookieStore.get("labprot-notification")
  $scope.show_info = false
  if $scope.notification
    $scope.show_info = true
    $cookieStore.remove "labprot-notification"
  $scope.form_user = $cookieStore.get("labprot-user")
  try
    $scope.form_user.laboratory = $scope.form_user.laboratory.id
  try
    $scope.form_user.clinic = $scope.form_user.clinic.id
  $scope.f =
    go_back: ->
      $location.path "/"
      return

    reset: (index) ->
      $scope["user_" + index] = false
      return

    validate: (index) ->
      unless $scope.form_user[index]
        $scope.valid = false
        $scope["user_" + index] = true
      return

    submit: ->
      $scope.valid = true
      fields = [
        "email"
        "password"
        "password_confirm"
      ]
      angular.forEach fields, $scope.f.reset
      angular.forEach fields, $scope.f.validate
      if $scope.valid
        if $scope.form_user.password is $scope.form_user.password_confirm
          User.update
            id: $scope.form_user.username
          , $scope.form_user, (resource) ->
            $cookieStore.remove "labprot-user"
            $cookieStore.remove "djangotoken"

            #                        $location.path("/");
            notification = "Por favor, entre com as suas novas informações."
            $cookieStore.put "labprot-notifications", notification
            window.location = "index.html"
            return

        else
          $scope.show_error = true
          $scope.error = "As passwords não coincidem."
      return

  return
