/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')

.directive('modal', function () {
	return {
		restrict: 'A',
		templateUrl: "components/Modal/ModalTemplate.htm",
		transclude: true,
		scope: {}
	};
});
