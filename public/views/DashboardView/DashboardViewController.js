/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */
/*
|--------------------------------------------------------------------------
| public/view/GeckoList/GeckoListController.js
|--------------------------------------------------------------------------
| Angular controller to display list of geckos.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/
angular.module('geckoTracker').controller('DashboardViewController', function ($scope, $http, ngDialog, toastr, geckoService, ModalService) {
    // KENNY: This might still be used for view-related UI things in the future, so we don't want to delete it.
		$scope.testShowPicker = true;
		$scope.testGeckoSelected = function(g) {
			console.log("GECKO SELECTED!", g);
		}
		
		$scope.showTestModal = function() {
			ModalService.showModal({
				templateUrl: "components/GeckoPicker/GeckoPickerTemplate.htm",
				controller: "GeckoPickerController"
			}).then(function(modal) {
				console.log(modal.element);
				modal.close.then(function(result) {
					console.log("Chose", result);
				});
			})
		}
})

.controller("TestModalController", function($scope, close) {
	
});
