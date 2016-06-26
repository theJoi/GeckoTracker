/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'ListGeckoController'
        })
        .when('/geckos/:id', {
            templateUrl: 'views/details.html',
            controller: 'GeckoDetailController'
        });

    $locationProvider.html5Mode(true);

}]);
