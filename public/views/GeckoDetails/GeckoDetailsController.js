/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

function GeckoDetail($scope, $http){
    $scope.details = {
        // how do i get the _id from the GeckoListController?
    };
}



angular.module('geckoTracker').controller('GeckoDetailController', GeckoDetail);
