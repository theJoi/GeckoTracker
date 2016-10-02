/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker', ['ngRoute','ngDialog','toastr','ngAnimate','ngFileUpload'])
.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });
})

.filter('prettyDate', function() {
	
});

