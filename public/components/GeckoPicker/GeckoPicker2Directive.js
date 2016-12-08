/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('geckoPicker', function () {
	return {
		restrict: 'E',
		scope: {
			label: "@",
			placeholder: "@?",
			gender: "@?",
			value: "="
		},
		templateUrl: "components/GeckoPicker/GeckoPicker2Template.htm",
		controller: function ($scope, $http, $log, geckoService, $location, $timeout, toastr, ModalService, $filter) {
			$log.debug("GeckoPicker directive's controller instantiated");
			
			if(!$scope.placeholder)
				$scope.placeholder = $scope.label;

			$scope.selected = null;
			$scope.curPage = 0;
			$scope.pageSize = 5;
			$scope.filtering = {
				search: "",
				curPage: 0
			};
			
			$scope.geckos = [];
			geckoService.getGeckos().then(function(geckos) {
				$scope.geckos = geckos;
				$scope.$apply();
			});
			
			$scope.showDropdown = false;
			
			$scope.$watch('filtering.search', function() {
				$scope.filtering.curPage = 0;
			});
			
			$scope.coverClicked = function() {
				console.log("Cover clicked!");
				$scope.showDropdown = false;
			}
			
			$scope.selectGecko = function(gecko) {
				//$scope.selected = gecko;
				$scope.value = gecko;
				console.log("SELECTED GECKO");
				$scope.showDropdown = false;
			}
			
			$scope.totalFilterCount = function() {
				console.log( $scope.filtering.search, $filter('filter')($scope.geckos, $scope.filtering.search) );
				return $filter('filter')($scope.geckos, $scope.filtering.search).length;
			}
		}
	};
})

.filter('startFrom', function() {
	return function(input, start) {
		start = +start;
		if(start > input.length-1)
			start = input.length - 4;
		return input.slice(start);
	}
});