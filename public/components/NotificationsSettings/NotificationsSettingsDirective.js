angular.module('geckoTracker')
.directive('notificationsSettings', function() {
	return {
		restrict: 'E',
		templateUrl: "components/NotificationsSettings/NotificationsSettingsTemplate.htm",
		controller: function($scope, $http, $log, toastr, geckoService, ModalService) {
			$log.debug("NotificationSettings directive's controller instantiated");
			
			$scope.events = [];
			geckoService.getGeckoEvents($scope.geckoId).then(function (events) {
				$scope.events = events;
				console.debug("NotificationsSettings events loaded", $scope.events);
				$scope.$apply();
			});
			
			$scope.notifications = [];
			geckoService.getNotifications().then(function(notifications) {
				$scope.notifications = notifications;
			});
			
			function findMostRecentEventOfType(t) {
				//console.log("findMostRecentEventOfType", $scope.events);
				var cur = null;
				for(var i=0;i < $scope.events.length;i++) {
					var evt = $scope.events[i];
					if(evt.type == t) {
						if(cur == null || evt.date > cur.date)
							cur = evt;
					}
				}
				return cur;
			}
			
			$scope.nextTrigger = function(notification) {
				if(!notification.enabled)
					return "";
				switch(notification.trigger) {
					case 'onDate':
						return new Date(notification.date);
					
					case 'fromEvent':
						// Find the previous event
						var evt = findMostRecentEventOfType(notification.event);
						if(evt == null)
							return "";
						var d = moment(evt.date);
						d.add(notification.days, 'd');
						return d.toDate();
				}
			}
			
			$scope.addNotification = function() {
				ModalService.showModal({
					templateUrl: "components/AddNotificationForm/AddNotificationFormTemplate.htm",
					controller: "AddNotificationFormController",
					inputs: {
						geckoId: $scope.geckoId
					}
				}).then(function(modal) {
					//modal.close.then(function(result) {
					//});
				});
			}
			
			$scope.deleteNotification = function(notification) {
				ModalService.showModal({
					templateUrl: "components/Modal/YesNoModalTemplate.htm",
					controller: "YesNoModalController",
					inputs: {
						title: "Are You Sure?",
						icon: "delete_forever",
						message: "This notification will be gone forever."
					}
				}).then(function(modal) {
					modal.close.then(function(result) {
						if(result) {
							geckoService.deleteNotification(notification._id).then(function() {
								toastr.success("Event deleted!", "Success");
							});
						}
					});
				});
			}
			
			$scope.setEnabled = function(notification, val) {
				notification.enabled = val;
				geckoService.updateNotification(notification._id, notification)
				.then(function(notification) {
					if(val)
						toastr.success("Notification enabled", "Success", {timeOut: 500});
					else
						toastr.success("Notification disabled", "Success", {timeOut: 500});
				});
			}
		}
	};
})

.filter('notificationIcon', function() {
	var mapping = {
		'warning': 'warning',
		'critical': 'error'
	}
	return function(val) {
		return mapping[val];
	}
})

.filter('niceNotificationTrigger', function() {
	var mapping = {
		'onDate': 'On Day',
		'fromEvent': 'Days Since Event'
	}
	return function(val) {
		//return mapping[val] ? mapping[val] : "Unknown (" + val + ")";
	}
})

.filter('humanizeDate', function() {
	return function(d) {
		if(d == "") return "";
		var m = moment(d).startOf('day');
		var n = moment().startOf('day');
		var days = m.diff(n, 'days', true);
		if(days == 1) return "tomorrow";
		return "in " + days + " days";
	}
})