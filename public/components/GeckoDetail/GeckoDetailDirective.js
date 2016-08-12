/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('geckoDetail', function () {
        return {
            restrict: 'E',
            templateUrl: "components/GeckoDetail/GeckoDetailTemplate.htm",
            controller: function ($scope, $http, $log, geckoService) {
                // $scope.geckos = [];
                $scope.isLoaded = false; // use to trigger loading spinner
                $log.debug("GeckoDetail directive's controller instantiated");

console.log($scope.geckoDetail);
console.log("orginal birthdate: " + $scope.geckoDetail.birthdate);


                /*geckoService.getGeckoDetails($scope.geckoId).then(function (gecko) {
                    $scope.gecko = gecko;

                    $scope.$apply();
                });*/


                $scope.resetForm = function () {
                    $scope.editform = angular.copy($scope.geckoDetail);
                    console.log("edit form copied");
                    console.log($scope.editform.name);
                };

                $scope.submitEditForm = function () {
                    console.log("submit form called");
                    console.log($scope.editform);

                    // remove unchanged properties
                    for (var property in $scope.editform) {
                        if ($scope.editform.hasOwnProperty(property)) {
                            if (property !== "_id" && $scope.editform[property] === $scope.geckoDetail[property]) {
                                delete $scope.editform[property];
                            }
                        }
                    }
                    console.log($scope.editform);
                    geckoService.updateGecko($scope.editform).then(function success(response) {
                        $scope.validationMsg = "The gecko named '" + $scope.editform.name + "' has successfully been updated.";
                        console.log("The gecko named '" + $scope.editform.name + "' has successfully been updated.");
                        $scope.showEditMode = false;
                        $scope.$apply();
                    }, function error(response) {
                        $scope.validationMsg = "Uh oh. Error occured, gecko not updated. Please try again.";
                        console.log("Uh oh. Error occured, gecko not updated. Please try again.");
                        console.log(response);
                    });
                    $scope.editGeckoForm.$setPristine();
                    $scope.showEditMode = false;
                    $scope.resetForm();
                };

                $scope.undo = function (attribute) {
                    console.log(attribute);
                    console.log("original value: " + $scope.geckoDetail[attribute]);
                    $scope.editform[attribute] = $scope.geckoDetail[attribute];
                    //   $scope.editGeckoForm.attribute.$setPrinstine();
                };

                $scope.triggerEditMode = function () {
                    if ($scope.showEditMode) {
                        $scope.showEditMode = false;
                    } else {
                        $scope.resetForm();
                        $scope.showEditMode = true;
                    }
                    console.log("copy birthdate:" + $scope.editform.birthdate);
                };

                $scope.deleteGecko = function (id, name) {
                    geckoService.removeGecko(id).then(function () {

                        $scope.statusMsg = "The gecko named '" + name + "' has successfully been deleted.";
                    });
                };
            }
        };
    });
