/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/GeckoList/GeckoListTemplate.htm',
            controller: 'GeckoListController'
        })
        .when('/new', {
            templateUrl: 'views/AddGecko/AddGeckoTemplate.htm',
            controller: 'AddGeckoController'
        })
        .when('/geckos/:id', {
            templateUrl: 'views/GeckoDetails/GeckoDetailsTemplate.htm',
            controller: 'GeckoDetailController'
        });

    $locationProvider.html5Mode(true);

}]);
