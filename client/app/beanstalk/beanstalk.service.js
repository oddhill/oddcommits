'use strict';

angular.module('oddcommitsApp')
  .service('beanstalk', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('/', {}, {
      getChangeset: {
        url: '/api/changesets',
        isArray: true
      },
      getRepository: {
        url: '/api/repositories/:id'
      }
    });
  });
