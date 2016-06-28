/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */
/*
|--------------------------------------------------------------------------
| public/view/AddGecko/AddGeckoController.js
|--------------------------------------------------------------------------
| Angular controller for form to add new gecko.
|
| Created June 2016 by Joi W.
|__________________________________________________________________________
*/

angular.module('geckoTracker').controller('AddGeckoController', function ($scope, $http) {
    $scope.validationMsg = "";
    $scope.form = {
        name: "",
        uniqueID: "",
        status: "unknown",
        sex: "unknown",
        morph: "",
        purchaseDate: "",
        birthDate: "",
        location: ""
    };


    $scope.submitForm = function () {
        console.log("submit form called");
        if (($scope.form.status === "dead" || $scope.form.status === "sold") && $scope.form.location === "") {
            $scope.form = "not applicable";
        }
        $http({
            method: 'POST',
            url: '/api/geckos',
            data: $scope.form
        }).then(function success(response) {
            $scope.geckos.push(response.data);
            $scope.validationMsg = "The gecko named '" + $scope.form.name + "' has successfully been added.";
            $scope.refreshGeckos();
            $scope.addGeckoForm.$setPristine();
        }, function error(response) {
            $scope.validationMsg = "Uh oh. Error occured, gecko not added. Please try again.";
        });
    };
});
