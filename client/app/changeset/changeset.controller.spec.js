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

  it('should ...', function () {
    console.log(ChangesetCtrl);
    expect(1).toEqual(1);
  });
});
