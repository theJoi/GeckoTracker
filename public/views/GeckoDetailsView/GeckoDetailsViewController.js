/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker').controller('GeckoDetailsViewController', function($scope, $http, $routeParams, geckoService) {

    $scope.statusMsg = "Say hi to...";
    $scope.geckoDetail = {};
    $scope.geckoId = $routeParams.id;
    console.log("id: " + $scope.geckoId);


    geckoService.getGeckoDetails($scope.geckoId).then(function(details) {
        $scope.geckoDetail = details;
        $scope.$apply();
    });
	
	$scope.testShowPicker = true;
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

