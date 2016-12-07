/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker').controller('GeckoDetailsViewController', function($scope, $http, $routeParams, $log, $location, $anchorScroll, geckoService, ModalService) {
	$log = $log.getInstance('views.GeckoDetailsView');

    $scope.statusMsg = "Say hi to...";
    $scope.geckoDetail = {};
    $scope.geckoId = $routeParams.id;
    $log.log("GeckoDetailsView controller instantiated with id=" + $scope.geckoId);

    geckoService.getGeckoDetails($scope.geckoId).then(function(details) {
        $scope.geckoDetail = details;
        $scope.$apply();
    });
	
	$scope.testShowPicker = true;
	
	$scope.goTo = function(hash) {
		var old = $location.hash();
		$location.hash(hash);
		$anchorScroll();
		$location.hash(old);
	}
	
	$scope.addWeightEvent = function() {
		ModalService.showModal({
			templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
			controller: "AddEventFormController",
			inputs: {
				event: 'weight',
				geckoId: $scope.geckoId
			}
		});
	}
	
	$scope.addClutchedEvent = function() {
		ModalService.showModal({
			templateUrl: "components/AddEventForm/AddEventFormTemplate.htm",
			controller: "AddEventFormController",
			inputs: {
				event: 'clutch',
				geckoId: $scope.geckoId
			}
		});
	}
/*
    $http({
        method: 'GET',
        url: '/api/geckos/' + id
    }).then(function success(response) {
        if (response.data.error) {
            console.log("Server side error! " + response.data.error);
            return;
        }
        $scope.geckoDetail = response.data.geckoDetail;
        $scope.statusMsg = "Say hi to " + $scope.geckoDetail.name + " the gecko!";
    }, function error(response) {
        var msg = "Error occurred: unable to get gecko " + response;
        console.log(msg);
        $scope.statusMsg(msg);
    }); */
});

