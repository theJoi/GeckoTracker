angular.module('geckoTracker')
.directive('eventsTable', function() {
	return {
		restrict: 'E',
        scope: {
            'id': '@geckoId'
        },
		templateUrl: "components/EventsTable/EventsTableTemplate.htm",
		controller: function($scope, $http, $log, geckoService) {
			$scope.events = [];
			$scope.isLoaded = false; // use to trigger loading spinner

			$log.debug("EventsTable directive's controller instantiated");
			
			geckoService.getGeckoEvents($scope.id).then(function(events) {
				$scope.events = events;
			});
		}
	};
});
