/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('geckoDetail', function () {
        return {
            restrict: 'E',
            templateUrl: "components/GeckoDetail/GeckoDetailTemplate.htm",
            controller: function ($scope, $http, $log, geckoService, $location, $timeout, toastr, ModalService) {
                // $scope.geckos = [];
                $scope.isLoaded = false; // use to trigger loading spinner
                $log.debug("GeckoDetail directive's controller instantiated");
                $scope.geckos = [];
                console.log($scope.geckoDetail);
                $scope.parentModal = {
                    shown: false
                };

                $scope.resetForm = function () {
                    $scope.editform = angular.copy($scope.geckoDetail);
                    $scope.edit.$setPristine();
                };

                $scope.submitEditForm = function () {
                    console.log("submit form called");
                    console.log($scope.editform);

                    // remove unchanged properties
                    for (var property in $scope.editform) {
                        if ($scope.editform.hasOwnProperty(property)) {
                            if (property !== "_id" && $scope.editform[property] === $scope.geckoDetail[property]) {
                                delete $scope.editform[property];
								console.log("Deleting " + property + " from update");
                            } else {
                                $scope.geckoDetail[property] = $scope.editform[property];
                            }
                        }
                    }
                    console.log("Updating...", $scope.editform);
                    geckoService.updateGecko($scope.editform).then(function success(response) {
                        $scope.validationMsg = "The gecko named '" + $scope.editform.name + "' has successfully been updated.";
                        console.log("The gecko named '" + $scope.editform.name + "' has successfully been updated.");
                        $scope.showEditMode = false;
                        $scope.$apply();
                    }, function error(response) {
                        //TODO: Change this to toastr message
                        $scope.validationMsg = "Uh oh. Error occured, gecko not updated. Please try again.";
                        console.log("Uh oh. Error occured, gecko not updated. Please try again.");
                        console.log(response);
						toastr.error("Error updating gecko details");
                    });

                    $scope.showEditMode = false;
                    $scope.resetForm();
                };

                $scope.undo = function (attribute) {
                    console.log(attribute);
                    console.log("original value: " + $scope.geckoDetail[attribute]);
                    $scope.editform[attribute] = $scope.geckoDetail[attribute];
                    $scope.edit[attribute].$setPristine();
                };

                $scope.triggerEditMode = function () {
                    if ($scope.showEditMode) {
                        $scope.showEditMode = false;
                    } else {
                        $scope.resetForm();
                        $scope.showEditMode = true;
                    }
                    console.log("copy birthdate: " + $scope.editform.birthdate);
                };

                $scope.deleteGecko = function (gecko) {
                    ModalService.showModal({
                        templateUrl: "components/Modal/YesNoModalTemplate.htm",
                        controller: "YesNoModalController",
                        inputs: {
                            title: "Are You Sure?",
                            icon: "delete_forever",
                            message: "Gecko " + gecko.name + " (#" + gecko.userId + ") will be permanently deleted."
                        }
                    }).then(function(modal) {
                        modal.close.then(function(result) {
                            if(result) {
                                geckoService.removeGecko(gecko._id).then(function () {
                                    $scope.statusMsg = "The gecko named '" + gecko.name + "' has successfully been deleted.";
                                    $timeout(function() {
                                        $location.path('/');
                                    }, 0);
                                    toastr.success(gecko.name + " was successfully deleted!");
                                });
                            }
                        });
                    });
                };

                $scope.showParentModal = function (gender) {
                    console.log("show parent modal triggered.");
                    geckoService.getGeckos().then(function (geckos) {
                        $scope.geckos = geckos;
                        $scope.$apply();
                    });
                    $scope.genderFilter = gender;
                    $scope.parentModal.shown = true;
                };

                $scope.setParent = function (gender, gecko) {
                    if (gender === "female") {
                        console.log("Mother => " + gecko._id);
                        $scope.editform.mother = {
                            _id: gecko._id,
                            name: gecko.name,
                            userId: gecko.userID
                        };
                    } else {
                        console.log("Father => " + gecko._id);
                        $scope.editform.father = {
                            _id: gecko._id,
                            name: gecko.name,
                            userId: gecko.userID
                        };
                    }
                    $scope.parentModal.shown = false;
                };

            }
        };
    });
