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
			$scope.filter = {
				search: '',
				sortProperty: 'date',
				sortDirection: '-'
			};
			//$scope.isLoaded = false; // use to trigger loading spinner

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
				ModalService.showModal({
					templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
					controller: "AddEventFormController",
					inputs: {
						event: null,
						geckoId: $scope.geckoId
					}
				});
			};

			$scope.editEvent = function(event) {
				ModalService.showModal({
					templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
					controller: "AddEventFormController",
					inputs: {
						event: event,
						geckoId: $scope.geckoId
					}
				});
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
