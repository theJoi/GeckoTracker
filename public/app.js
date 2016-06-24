/*jshint globals: true, undef: true, browser: false, node: true*/
/* globals angular */

angular.module('geckoTracker', []).controller('GeckoListController', function($scope, $http){
        $scope.geckos = [];
        $scope.isLoaded = false;

        $http({
            method: 'GET',
            url: '/geckos'
        }).then(function success(response) {
            if(response.data.error) {
                console.log("Server side error! " + response.data.error);
                return;
            }
            $scope.geckos = response.data;
            $scope.isLoaded = true;
        }, function error(response) {
            console.log("Error occurred: unable to get list of geckos " + response);
        });
});
