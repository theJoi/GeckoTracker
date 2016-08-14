/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('geckoMetrics', function() {
	return {
		restrict: 'E',
		templateUrl: "components/GeckoMetrics/GeckoMetricsTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
            $scope.metrics = [];
            geckoService.getMetrics().then(function(metrics) {
                $scope.metrics = metrics;
                $scope.$apply();
            });
		}
	};
});
