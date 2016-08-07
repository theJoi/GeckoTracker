/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('addGeckoForm', function () {
            return {
                restrict: 'E',
                templateUrl: "components/AddGeckoForm/AddGeckoFormTemplate.htm",
                controller: function ($scope, geckoService) {
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
                        birthdate: "",
                        location: "",
                        currWeight: "",
                        mother: "",
                        father: ""
                    };
                    $scope.showForm = '';

                    console.log("AddGeckoForm directive's controller instantiated");

                    $scope.submitForm = function () {
                        console.log("submit form called");
                        if (($scope.form.status === "dead" || $scope.form.status === "sold") && $scope.form.location === "") {
                            $scope.form.location = "not applicable";
                        }

                        geckoService.addGecko($scope.form).then(function success(response) {
                            $scope.validationMsg = "The gecko named '" + $scope.form.name + "' has successfully been added.";
                            console.log("The gecko named '" + $scope.form.name + "' has successfully been added.");
                            $scope.showForm = false;
                        }, function error(response) {
                            $scope.validationMsg = "Uh oh. Error occured, gecko not added. Please try again.";
                        });
                    };
                }
            };
        });
