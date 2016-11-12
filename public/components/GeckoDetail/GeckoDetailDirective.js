/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
.directive('geckoDetail', function () {
	return {
		restrict: 'E',
		templateUrl: "components/GeckoDetail/GeckoDetailTemplate.htm",
		controller: function ($scope, $http, $log, geckoService, $location, $timeout, toastr, ModalService) {
			$log = $log.getInstance("GeckoDetail");
			
			// $scope.geckos = [];
			$scope.isLoaded = false; // use to trigger loading spinner
			$log.debug("GeckoDetail directive's controller instantiated");
			$scope.geckos = [];
			$log.log($scope.geckoDetail);
			$scope.parentModal = {
				shown: false
			};

			$scope.resetForm = function () {
				$scope.editform = angular.copy($scope.geckoDetail);
				$scope.edit.$setPristine();
			};

			$scope.submitEditForm = function () {
				$log.log("submit form called");
				$log.log($scope.editform);

				// remove unchanged properties
				for (var property in $scope.editform) {
					if ($scope.editform.hasOwnProperty(property)) {
						if (property !== "_id" && $scope.editform[property] === $scope.geckoDetail[property]) {
							delete $scope.editform[property];
							$log.log("Deleting " + property + " from update");
						} else {
							$scope.geckoDetail[property] = $scope.editform[property];
						}
					}
				}
				$log.log("Updating...", $scope.editform);
				geckoService.updateGecko($scope.editform).then(function success(response) {
					$scope.validationMsg = "The gecko named '" + $scope.editform.name + "' has successfully been updated.";
					$log.log("The gecko named '" + $scope.editform.name + "' has successfully been updated.");
					$scope.showEditMode = false;
					$scope.$apply();
				}, function error(response) {
					//TODO: Change this to toastr message
					$scope.validationMsg = "Uh oh. Error occured, gecko not updated. Please try again.";
					$log.log("Uh oh. Error occured, gecko not updated. Please try again.");
					$log.log(response);
					toastr.error("Error updating gecko details");
				});

				$scope.showEditMode = false;
				$scope.resetForm();
			};

			$scope.undo = function (attribute) {
				$log.log(attribute);
				$log.log("original value: " + $scope.geckoDetail[attribute]);
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
				$log.log("copy birthdate: " + $scope.editform.hatchDate);
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
				$log.log("show parent modal triggered.");
				geckoService.getGeckos().then(function (geckos) {
					$scope.geckos = geckos;
					$scope.$apply();
				});
				$scope.genderFilter = gender;
				$scope.parentModal.shown = true;
			};

			$scope.setParent = function (gender, gecko) {
				if (gender === "female") {
					$log.log("Mother => " + gecko._id);
					$scope.editform.mother = {
						_id: gecko._id,
						name: gecko.name,
						userId: gecko.userID
					};
				} else {
					$log.log("Father => " + gecko._id);
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
