/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular, Promise, response */

angular.module('geckoTracker')
.factory('modalService', function ($log) {
	var modal = {
		deferred: null,
		params: null
	};
	
	
	function open(type, params) {
		
	}