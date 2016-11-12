/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.controller('AddEventFormController', function ($scope, $http, $log, geckoService, toastr, event, geckoId, close) {
	$log.debug("AddEventForm directive's controller instantiated", geckoId, event);

	if(!event) {
		$scope.isEdit = false;
		$scope.form = {
			date: moment(),
			info: {}
		};
	} else {
		$scope.isEdit = true;
		$scope.form = {
			date: moment(event.date),
			type: event.type,
			notes: event.notes,
			info: event.info
		};
	}
	$scope.form.typeOptions = {
		clutch: "Laid Clutch",
		weight: "Weight"
	}
//					<option value="clutch">Laid Clutch</option>
//					<option value="weight">Weight</option>
//					<option value="shed">Shed</option>
//					<option value="hatch">Hatched</option>
//					<option value="laid">Laid</option>
//					<option value="note">Note</option>
	
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

