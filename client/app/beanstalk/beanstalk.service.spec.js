'use strict';

describe('Service: beanstalk', function () {

  // load the service's module
  beforeEach(module('oddcommitsApp'));

  // instantiate service
  var beanstalk;
  beforeEach(inject(function (_beanstalk_) {
    beanstalk = _beanstalk_;
  }));

  it('should do something', function () {
    expect(!!beanstalk).toBe(true);
  });

});
