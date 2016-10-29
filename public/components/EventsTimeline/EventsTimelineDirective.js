/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

.directive('eventsTimeline', function () {
	return {
		restrict: 'E',
		scope: {
				show: "=",
				genderFilter: "@",
				onSelect: "&",
				onCancel: "&"
		},
		templateUrl: "components/GeckoPicker/GeckoPickerTemplate.htm",
		controller: function ($scope, $http, $log, geckoService) {
			$log.debug("GeckoPicker directive's controller instantiated");
			$log.debug($scope);

			geckoService.getGeckos().then(function(geckos) {
				$scope.geckos = geckos;
				$scope.$apply();
			});
			
				 -}
			$scope.selectGecko = function(g) {
				console.log("Select gecko");
				$scope.onSelect({gecko: g});
				$scope.show = false;
			}
			
			$scope.cancelSelection = function() {
				$scope.show = false;
			}
		}
	};
})
*/

.filter('capitalize', function() {
	return function(input) {
		return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
	}
})