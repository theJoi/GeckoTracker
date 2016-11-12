/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.controller('AddEventFormController', function ($scope, $http, $log, geckoService, toastr, event, geckoId, close) {
	$log.debug("AddEventForm directive's controller instantiated", geckoId, event);

	if(!event) {
		$scope.isEdit = false;
		$scope.form = {
			date: new Date(),
			info: {}
		};
	} else {
		$scope.isEdit = true;
		$scope.form = {
			date: new Date(event.date),
			type: event.type,
			notes: event.notes,
			info: event.info
		};
	}
	
	$scope.close = close;
	
	$scope.addEvent = function () {
		geckoService.createGeckoEvent(geckoId, $scope.form).then(function () {
			close();
			toastr.success("Event added");
			$scope.$apply();
		}, function error(err) {
			close();
			console.error("AddEventFormController", err);
			toastr.error("Failed to add event");
		});
	};

	$scope.editEvent = function () {
		geckoService.updateGeckoEvent(event._id, $scope.form).then(function() {
			close();
			toastr.success("Event updated");
		}, function error(err) {
			close();
			console.error("AddEventFormController", err);
			toastr.error("Failed to edit event (" + err + ")");
		});
	};
});

