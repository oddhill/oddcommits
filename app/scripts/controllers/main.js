'use strict';

/**
 * @ngdoc function
 * @name oddcommitsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the oddcommitsApp
 */
angular.module('oddcommitsApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
