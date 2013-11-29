var beanstalk = angular.module('beanstalk', ['beanstalkControllers', 'ngRoute', 'md5', 'ui-gravatar']);

beanstalk.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/root.html'
    }).
    otherwise({
      redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});
