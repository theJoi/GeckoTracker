/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker', []).controller('GeckoListController', function ($scope, $http) {
    $scope.geckos = [];
    $scope.isLoaded = false;
    $scope.statusMsg = "Welcome to Gecko Tracker";

    // Function to populate list of geckos
    $scope.refreshGeckos = function () {
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
            var msg = "Error occurred: unable to get list of geckos " + response;
            console.log(msg);
            $scope.statusMsg(msg);
        });
    };
    $scope.refreshGeckos();

    $scope.confirmDelete = function (id, name) {
        // well dialog box invocation will be
    };

    $scope.deleteGecko = function (id, name) {
        console.log("delete gecko button clicked");
        $http({
            method: 'DELETE',
            url: "/geckos/" + id
        }).then(function success(response) {
            $scope.geckos.pop(response.data);
            $scope.statusMsg = "The gecko named '" + $scope.form.name + "' has successfully been deleted.";
            $scope.refreshGeckos();
        }, function error(response) {
            $scope.statusMsg = "Uh oh. Error occured, gecko not added. Please try again.";
        });
    };
}).controller('AddGeckoController', function ($scope, $http) {
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
            url: '/geckos',
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
