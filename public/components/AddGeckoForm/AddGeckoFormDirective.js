/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('addGeckoForm', function () {
        return {
            restrict: 'E',
            templateUrl: "components/AddGeckoForm/AddGeckoFormTemplate.htm",
            controller: function ($scope, geckoService) {
                $scope.validationMsg = "Name and ID are required. If you don't have an ID please enter the name of the gecko for both fields.";
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
                $scope.parentModal = {
                    shown: false
                };

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

                $scope.showParentModal = function (gender) {
                    console.log("show parent modal triggered.");
                    $scope.genderFilter = gender;
                    $scope.parentModal.shown = true;
                };

                $scope.setParent = function (gender, gecko) {
                    if (gender === "female") {
                        console.log("Mother => " + gecko._id);
                        $scope.form.mother = {
                            _id: gecko._id,
                            name: gecko.name,
                            userId: gecko.userID
                        };
                    } else if (gender === "male") {
                        console.log("Father => " + gecko._id);
                        $scope.form.father = {
                            _id: gecko._id,
                            name: gecko.name,
                            userId: gecko.userID
                        };
                    } else {
                        console.log("gender problem occured.");
                    }
                    $scope.parentModal.shown = false;
                };
            }
        };
    });
