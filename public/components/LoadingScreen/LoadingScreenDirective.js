/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('loadingScreen', function (ngDialog, toastr) {
	return {
		restrict: 'E',
		templateUrl: "components/LoadingScreen/LoadingScreenTemplate.htm",
		controller: function ($scope, $log, $rootScope, geckoService) {
			$log = $log.getInstance("LoadingScreen");
			$log.debug("Directive's controller instantiated");
			$rootScope.appLoaded = false;
			
			geckoService.getGeckos()
			.then(function() {
				$rootScope.appLoaded = true;
				$log.debug("app loaded");
				$rootScope.$apply();
			});
		}
	};
});
