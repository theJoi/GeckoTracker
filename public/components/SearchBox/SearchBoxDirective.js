/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.directive('searchBox', function () {
	return {
		restrict: 'E',
		scope: {
			value: "="
		},
		templateUrl: "components/SearchBox/SearchBoxTemplate.htm",
		controller: function ($scope, $http, $log) {
			
		}
	};
})
