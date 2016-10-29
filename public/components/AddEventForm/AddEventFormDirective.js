/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.directive('addEventForm', function () {
	return {
		restrict: 'E',
		scope: {
			show: "=",
			event: "=?",
			geckoId: "@"
		},
		templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
		controller: function ($scope, $http, $log, geckoService, toastr) {
			$log.debug("AddEventForm directive's controller instantiated");
			
			$log.debug("event=", $scope.event);
			
			$scope.$watch("show", function() {
				// Modal was shown
				if($scope.show) {
					$log.debug("AddEventForm show triggered");
					if(!$scope.event)
						$scope.form = {
							date: new Date(),
							info: {}
						};
					else
						$scope.form = {
							date: new Date($scope.event.date),
							type: $scope.event.type,
							notes: $scope.event.notes,
							info: $scope.event.info
						};
				}
			});

			$scope.addEvent = function () {
				console.log("id", $scope, $scope.geckoId);

				geckoService.createGeckoEvent($scope.geckoId, $scope.form).then(function () {
					$scope.show = false;
					toastr.success("Event added");
				}, function error(err) {
					console.log(err);
					toastr.error("Failed to add event");
				});
			};
			$scope.cancelForm = function() {
				$scope.show = false;
			}
		}
	};
})
