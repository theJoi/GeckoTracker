/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

function GeckoDetail($scope, $http){
    var id = $routeParams.id;
    console.log("id" + id);

    $http({
        method: 'GET',
        url: '/geckos/' +id
    }).then(function success(response) {
        if (response.data.error) {
            console.log("Server side error! " + response.data.error);
            return;
        }
        $scope.geckoDetail = response.data;
    }, function error(response) {
        var msg = "Error occurred: unable to get list of geckos " + response;
        console.log(msg);
        $scope.statusMsg(msg);
    });
    };




angular.module('geckoTracker').controller('GeckoDetailController', GeckoDetail);
