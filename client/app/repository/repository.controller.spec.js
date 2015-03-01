'use strict';

describe('Controller: RepositoryCtrl', function () {

  // load the controller's module
  beforeEach(module('oddcommitsApp'));

  var RepositoryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryCtrl = $controller('RepositoryCtrl', {
      $scope: scope
    });
  }));

  it('should contain an empty object of repositories', function () {
    expect(scope.repositories).toEqual({});
  });
});
