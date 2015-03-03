'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('oddcommitsApp'));

  var MainCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should contain an empty object of commits', function () {
    expect(scope.commits).toEqual({});
  });

  it('should contain an empty object of repositories', function () {
    expect(scope.repositories).toEqual({});
  });
});
