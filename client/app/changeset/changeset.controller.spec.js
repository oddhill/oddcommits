'use strict';

describe('Controller: ChangesetCtrl', function () {

  // load the controller's module
  beforeEach(module('oddcommitsApp'));

  var ChangesetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChangesetCtrl = $controller('ChangesetCtrl', {
      $scope: scope
    });
  }));

  it('should contain an empty object of commits', function () {
    expect(scope.commits).toEqual({});
  });
});
