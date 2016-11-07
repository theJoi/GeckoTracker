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
		controller: function ($scope, $http, $log, geckoService, ModalService, toastr) {
			$log.debug("EventsTable directive's controller instantiated with id=" + $scope.geckoId);

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
						if (value.notes && value.notes.toLowerCase().indexOf(foo[i]) == -1)
							return false;
					}
				}
				return true;
				//				return value.type == 'note';
			};

			function reloadEvents() {}
			
			function reloadEvents2() {
				$scope.$apply();
			}
			
			if($scope.geckoId) {
				geckoService.getGeckoEvents($scope.geckoId).then(function(events) {
					console.debug("EventsTable got events", events);
					$scope.events = events;
					$scope.$apply();
				});
			}
			
			/*
			function reloadEvents() {
				geckoService.getGeckoEvents($scope.geckoId).then(function (events) {
					$scope.events = events;
					console.log("EVENTS", events);
					$scope.$apply();
				});
			}
			$scope.$watch("geckoId", function () {
				console.log("EventsTable id changed", $scope.geckoId);
				if ($scope.geckoId)
					reloadEvents();
			});
			*/

			$scope.$watch("showAddEventForm", function() {
				if(!$scope.showAddEventForm)
					reloadEvents();
			});


			$scope.addEvent = function () {
				console.log("id", $scope, $scope.geckoId);
				$scope.eventToEdit = undefined;
				$scope.showAddEventForm = true;
				return;
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
						if(event.info && event.info.eggs)
							$scope.options.info = { eggs: event.info.eggs };
						else
							$scope.options.info = { eggs: null };
						break;
				}
			}

			$scope.editEvent = function(event) {
				$scope.eventToEdit = event;
				$scope.showAddEventForm = true;
			};

			$scope.deleteEvent = function(event) {
				ModalService.showModal({
					templateUrl: "components/Modal/YesNoModalTemplate.htm",
					controller: "YesNoModalController",
					inputs: {
						title: "Are You Sure?",
						icon: "delete_forever",
						message: "The event will be gone forever."
					}
				}).then(function(modal) {
					modal.close.then(function(result) {
						if(result) {
							geckoService.deleteGeckoEvent(event._id).then(function() {
								reloadEvents();
								toastr.success("Event deleted!");
							});
						}
					});
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
		if (val == 'hatch') return "Hatched";
		return val[0].toUpperCase() + val.substring(1);
	};
});
