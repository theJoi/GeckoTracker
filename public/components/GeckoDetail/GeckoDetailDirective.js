/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('geckoDetail', function() {
	return {
		restrict: 'E',
        scope: {
            'geckoId': '=',
        },
		templateUrl: "components/GeckoDetail/GeckoDetailTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			$scope.geckos = [];
			$scope.isLoaded = false; // use to trigger loading spinner

			$log.debug("GeckoDetail directive's controller instantiated");

			geckoService.getGeckoDetails($scope.geckoId).then(function(gecko) {
				$scope.gecko = gecko;
				$scope.$apply();
			});
		}
	};
});
