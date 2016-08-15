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
    .directive('eventsTable', function (ngDialog, toastr) {
        return {
            restrict: 'E',
            scope: {
                'geckoId': '=',
            },
            templateUrl: "components/EventsTable/EventsTableTemplate.htm",
            controller: function ($scope, $http, $log, geckoService) {
                console.log("id", $scope, $scope.geckoId);

                $scope.events = [];
                $scope.options = {
                    date: new Date(),
                    type: 'note',
                    info: {},
                    notes: ''
                };
                $scope.filter = {
                    search: '',
                    sortProperty: 'date',
                    sortDirection: '-'
                };
                $scope.isLoaded = false; // use to trigger loading spinner

                $log.debug("EventsTable directive's controller instantiated");

                $scope.setSort = function (property) {
                    if ($scope.filter.sortProperty == property){
                        $scope.filter.sortDirection = $scope.filter.sortDirection == '+' ? '-' : '+';
                    }
                    $scope.filter.sortProperty = property;
                };

                $scope.filterEvents = function (value, index, array) {
                    var foo = $scope.filter.search.toLowerCase();
                    foo = foo.split(',');
                    for (var i = 0; i < foo.length; i++) {
                        if (foo[i].trim() === '')
                            continue;
                        switch (foo[i]) {
						case 'laid':
						case 'hatch':
						case 'purchase':
						case 'death':
                        case 'note':
                        case 'shed':
                        case 'weight':
                        case 'clutch':
                            if (value.type.toLowerCase() != foo[i]) return false;
                            break;
                        default:
                            if (value.notes.toLowerCase().indexOf(foo[i]) == -1)
                                return false;
                        }
                    }
                    return true;
                    //				return value.type == 'note';
                };

                function reloadEvents() {
                    geckoService.getGeckoEvents($scope.geckoId).then(function (events) {
                        $scope.events = events;
                        console.log("EVENTS", events);
                        $scope.$apply();
                    });
                }
                $scope.$watch("geckoId", function () {
                    console.log("geckoID changed", $scope.geckoId);
                    if ($scope.geckoId)
                        reloadEvents();
                });


                $scope.addEvent = function () {
                    console.log("id", $scope, $scope.geckoId);

                    geckoService.createGeckoEvent($scope.geckoId, $scope.options).then(function () {
                        toastr.success("Event added");
						resetAddEventOptions();
                        reloadEvents();
                    });
                };
				
				function resetAddEventOptions() {
					$scope.options.notes = '';
					$scope.options.info = {};
					$scope.options.date = new Date();
				}
				
				$scope.selectedEvents = {};
				
				$scope.isEventSelected = function(event) {
					return event._id in $scope.selectedEvents;
				}
				
				$scope.selectEvent = function(event) {
					console.log("selectEvent", event);
					if(!$scope.isEventSelected(event)) {
						$scope.selectedEvents[event._id] = event;
					}
					if($scope.selectedEventsCount() == 1) {
						setOptionsFromEvent(event);
					} else {
						resetAddEventOptions();
					}
				}
				
				function setOptionsFromEvent(event) {
					$scope.options.date = new Date(event.date);
					$scope.options.type = event.type;
					$scope.options.notes = event.notes;
					switch(event.type) {
						case 'weight':
							$scope.options.info = { weight: event.info.weight };
							break;
						case 'clutch':
							$scope.options.info = { eggs: event.info.eggs };
					}
				}
				
				$scope.unselectEvent = function(event) {
					if(!$scope.isEventSelected(event))
						return;
					delete $scope.selectedEvents[event._id];

					if($scope.selectedEventsCount() == 1) {
						var event = $scope.selectedEvents[Object.keys($scope.selectedEvents)[0]];
						setOptionsFromEvent(event);
					} else {
						resetAddEventOptions();
					}
				}
				
				$scope.selectedEventsCount = function() {
					return Object.keys($scope.selectedEvents).length;
				}
				
				$scope.deleteSelectedEvent = function() {
					var event = $scope.selectedEvents[Object.keys($scope.selectedEvents)[0]];
					geckoService.deleteGeckoEvent(event._id).then(function() {
						$scope.unselectEvent(event);
                        toastr.success("Event deleted");
						reloadEvents();
					});
				}
				
				$scope.updateSelectedEvent = function() {
					var event = $scope.selectedEvents[Object.keys($scope.selectedEvents)[0]];
					geckoService.updateGeckoEvent(event._id, $scope.options).then(function() {
						$scope.unselectEvent(event);
                        toastr.success("Event updated");
						reloadEvents();
					});
				}
            }
        };
    })
    .filter('prettyEventType', function () {
		var mapping = {
			'clutch': 'Laid clutch',
			'weight': 'Weight',
			'laid': 'Laid',
			'copulation': 'Copulation'
		};
        return function (val) {
            if (val == 'clutch') return "Laid clutch";
            return val[0].toUpperCase() + val.substring(1);
        };
    });
