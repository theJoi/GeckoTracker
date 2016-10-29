/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.controller('YesNoModalController', function($scope, $log, title, icon, message, close) {
	$scope.title = title;
	$scope.message = message;
	$scope.icon = icon;
	
	$scope.close = function() {
		close(false);
	}
	
	$scope.yes = function() {
		close(true);
	}
})

.controller('AlertModalController', function($scope, $log, title, icon, message, close) {
	$scope.title = title;
	$scope.message = message;
	$scope.icon = icon;
	
	$scope.close = function() {
		close();
	}
});
