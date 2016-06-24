/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker', []).controller('GeckoListController', function ($scope, $http) {
    $scope.geckos = [];
    $scope.isLoaded = false;

    $scope.refreshGeckos = function() {
        $http({
            method: 'GET',
            url: '/geckos'
        }).then(function success(response) {
            if (response.data.error) {
                console.log("Server side error! " + response.data.error);
                return;
            }
            $scope.geckos = response.data;
            $scope.isLoaded = true;
        }, function error(response) {
            console.log("Error occurred: unable to get list of geckos " + response);
        });
    };
    $scope.refreshGeckos();
}).controller('AddGeckoController', function ($scope, $http) {
    $scope.validationMsg = "Status message will be here";
    $scope.form = {
        name: "",
        uniqueID: "",
        status: "unknown",
        sex: "unknwon",
        morph: "",
        purchaseDate: "",
        birthDate: "",
        location: ""
    };

    $scope.submitForm = function () {
        console.log("submit form called");
        $http({
            method: 'POST',
            url: '/geckos',
            data: $scope.form
        }).then(function success(response) {
            $scope.geckos.push(response.data);
            $scope.validationMsg = "The gecko named " + $scope.form.name + " has successfully been added.";
            $scope.refreshGeckos();
        }, function error(response) {
             $scope.validationMsg = "Uh oh.";
            alert("Error occured. Gecko not added.");
        });
    };
});
