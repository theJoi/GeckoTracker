/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/DashboardView/DashboardViewTemplate.htm',
            controller: 'DashboardViewController'
        })
        .when('/geckos/:id', {
            templateUrl: 'views/GeckoDetailsView/GeckoDetailsViewTemplate.htm',
            controller: 'GeckoDetailsViewController'
        })
		.when('/demos', {
			templateUrl: 'views/DemosView/DemosViewTemplate.htm',
			controller: 'DemosViewController'
		});

    $locationProvider.html5Mode(true);

}]);
