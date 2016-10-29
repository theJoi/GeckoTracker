/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.controller('YesNoDialogController', function($scope, $log, title, message, close) {
	$scope.title = title;
	$scope.message = message;
	
	$scope.close = function() {
		close(false);
	}
	
	$scope.yes = function() {
		close(yes);
	}
})
