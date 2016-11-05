/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.controller('GeckoPickerController', function($scope, $log, geckoService, gender, close) {
	$log.debug("GeckoPicker directive's controller instantiated");
	$log.debug($scope);

	$scope.genderFilter = gender;

	geckoService.getGeckos().then(function(geckos) {
		$scope.geckos = geckos;
		$scope.$apply();
	});

	$scope.selectGecko = function(g) {
		console.log("Select gecko");
		//$scope.onSelect({gecko: g});
		//$scope.show = false;
		close(g);
	}

	$scope.cancelSelection = function() {
		//$scope.show = false;
		close(null);
	}
})

/*
.directive('geckoPicker', function () {
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
