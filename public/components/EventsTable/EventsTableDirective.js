/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */
/*
|--------------------------------------------------------------------------
| public/components/EventsTable/EventsTableDirective.js
|--------------------------------------------------------------------------
| Angular controller for form to add new gecko.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/

angular.module('geckoTracker')
.directive('eventsTable', function(ngDialog, toastr) {
	return {
		restrict: 'E',
        scope: {
            'geckoId': '=',
        },
		templateUrl: "components/EventsTable/EventsTableTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			console.log("id", $scope, $scope.geckoId);
			
			$scope.events = [];
			$scope.options = {
				date: new Date(),
				type: 'note',
				info: {},
				notes: ''
			};
			$scope.isLoaded = false; // use to trigger loading spinner

			$log.debug("EventsTable directive's controller instantiated");

			function reloadEvents() {
				geckoService.getGeckoEvents($scope.geckoId).then(function(events) {
					$scope.events = events;
					console.log("EVENTS", events);
					$scope.$apply();
				});
			}
			$scope.$watch("geckoId", function() {
				console.log("geckoID changed", $scope.geckoId);
				if($scope.geckoId)
					reloadEvents();
			});

			
			$scope.addEvent = function() {
				console.log("id", $scope, $scope.geckoId);
				
				geckoService.createGeckoEvent($scope.geckoId, $scope.options).then(function() {
					toastr.success("Event added");
					$scope.options.notes = '';
					$scope.options.info = {};
					$scope.options.date = new Date();
					reloadEvents();
				});
			};
		}
	};
});

