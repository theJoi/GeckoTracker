/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.controller('AddNotificationFormController', function ($scope, $http, $log, geckoService, toastr, geckoId, close) {
	console.debug("ADD NOTIFICATION FORM CONTROLLER");
	
	$scope.close = close;
	
	$scope.form = {
		gecko: geckoId,
		enabled: true
	};
	
	$scope.triggerTypes = ['On Date', 'Days From Event'];
	$scope.eventTypes = ['Weight', 'Hatched', 'Clutched', 'Copulated', 'Note'];
	
	var triggerMap = {
		'On Date': 'onDate',
		'Days From Event': 'fromEvent'
	};
	
	$scope.commit = function() {
		var props = JSON.parse(JSON.stringify($scope.form));
		
		props.trigger = triggerMap[props.trigger];
		if(props.event) props.event = props.event.toLowerCase();

		console.log(props);
		
		geckoService.createNotification(props)
		.then(function() {
			toastr.success("Created new notification", "Success");
			close();
		});
	}
	
//	$log.debug("AddEventForm directive's controller instantiated");
//
//	$log.debug("event=", $scope.event);

//	$scope.$watch("show", function() {
//		// Modal was shown
//		if($scope.show) {
//			$log.debug("AddEventForm show triggered", $scope.event);
//			if(!$scope.event) {
//				$scope.isEdit = false;
//				$scope.form = {
//					date: new Date(),
//					info: {}
//				};
//			} else {
//				$scope.isEdit = true;
//				$scope.form = {
//					date: new Date($scope.event.date),
//					type: $scope.event.type,
//					notes: $scope.event.notes,
//					info: $scope.event.info
//				};
//			}
//		}
//	});
//
//	$scope.addEvent = function () {
//		console.log("id", $scope, $scope.geckoId);
//
//		geckoService.createGeckoEvent($scope.geckoId, $scope.form).then(function () {
//			$scope.show = false;
//			toastr.success("Event added");
//		}, function error(err) {
//			console.log(err);
//			toastr.error("Failed to add event");
//		});
//	};
//
//	$scope.editEvent = function () {
//		console.log($scope.event._id);
//		geckoService.updateGeckoEvent($scope.event._id, $scope.form).then(function() {
//			$scope.show = false;
//			toastr.success("Event updated");
//		}, function error(err) {
//			console.log(err);
//			toastr.error("Failed to edit event (" + err + ")");
//		});
//	};
//
//	$scope.cancelForm = function() {
//		$scope.show = false;
//	}
})
