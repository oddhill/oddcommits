'use strict';

describe('Service: model', function () {

  // load the service's module
  beforeEach(module('oddcommitsApp'));

  // instantiate service
  var model;
  beforeEach(inject(function (_model_) {
    model = _model_;
  }));

  it('should do something', function () {
    expect(!!model).toBe(true);
  });

});
