/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker', ['ngRoute','ngDialog','toastr','ngAnimate','ngFileUpload','angularModalService','angular-logger'])
.config(function(toastrConfig, logEnhancerProvider) {
	// Set global toastr options
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right'
    });
	
	// Configure angular-logger
	logEnhancerProvider.prefixPattern = "%2$s:%3$s:";
	logEnhancerProvider.logLevels = {
		//'EventsTable': logEnhancerProvider.LEVEL.DEBUG,
		'GeckoService': logEnhancerProvider.LEVEL.DEBUG,
		'LoadingScreen': logEnhancerProvider.LEVEL.DEBUG,
		'*': logEnhancerProvider.LEVEL.ERROR
	};
})

.filter('prettyDate', function() {
	
});

