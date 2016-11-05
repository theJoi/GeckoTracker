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

angular.module('geckoTracker').controller('AddGeckoController', function ($scope, geckoService) {
    $scope.validationMsg = "";
    /* Initial form values */
    $scope.form = {
        name: "",
        userId: "",
        stage: "unknown",
        status: "unknown",
        sex: "unknown",
        morph: "",
        purchaseDate: "",
        hatchDate: "",
        location: "",
        currWeight: "",
        mother: "",
        father: ""
    };



    $scope.submitForm = function () {
        console.log("submit form called");
        if (($scope.form.status === "dead" || $scope.form.status === "sold") && $scope.form.location === "") {
            $scope.form.location = "not applicable";
        }
        // If no ID entered make name the ID
        // If no name entered make ID the name
        geckoService.addGecko($scope.form).then(function success(response) {
            $scope.validationMsg = "The gecko named '" + $scope.form.name + "' has successfully been added.";
            $scope.showForm = false;
        }, function error(response) {
            $scope.validationMsg = "Uh oh. Error occured, gecko not added. Please try again.";
        });
    };
});
